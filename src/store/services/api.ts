import { BaseQueryFn, createApi, FetchArgs, fetchBaseQuery, FetchBaseQueryError } from '@reduxjs/toolkit/query/react';

// ** Redux imports
import { RootState } from '..';
import { logout, tokenReceived } from '../features/user';

//** Async mute imports
import { Mutex } from 'async-mutex';

//** Utils imports
import { decodeJWT } from '@/lib/utils';

// create a new mutex
const mutex = new Mutex()

const baseQuery = fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'https://localhost:7182/api',
    prepareHeaders: (headers, api) => {
        headers.set('Accept', 'application/json');
        // By default, if we have a token in the store, let's use that for authenticated requests
        const { accessToken } = (api.getState() as RootState).user;
        console.log('first fetch')
        if (accessToken) {
            headers.set('Authorization', `Bearer ${accessToken}`);
        }

        return headers;
    },
    timeout: 60 * 1000, // default timeout 10 sec
})

//const wrapperBaseQuery = (...args) => {
//    console.log("API CALL: ", args)
//    return orignalBaseQuery(...args)
//}

const baseQueryWithReauth: BaseQueryFn<
    string | FetchArgs,
    unknown,
    FetchBaseQueryError
> = async (args, api, extraOptions) => {
    // wait until the mutex is available without locking it
    await mutex.waitForUnlock();

    let result = await baseQuery(args, api, extraOptions);
    const { refreshToken, accessToken } = (api.getState() as RootState).user;
    if (refreshToken && result.error && result.error.status === 401) {
        // try to get a new token
        //console.log('getToken')
        if (!mutex.isLocked()) {
            const release = await mutex.acquire();
            try {
                const refreshResult = await baseQuery({
                    url: '/auth/refresh',
                    method: 'POST',
                    body: {
                        accessToken,
                        refreshToken
                    }
                }, api, extraOptions) //as any; 
                //console.log({ refreshResult })
                if (refreshResult.data) {
                    const accessToken = (refreshResult.data as any).accessToken; // eslint-disable-line @typescript-eslint/no-explicit-any
                    const jwt = decodeJWT(accessToken);
                    // store the new token
                    api.dispatch(tokenReceived({ ...refreshResult.data, email: jwt.email, roles: jwt.roles }));
                    //api.dispatch(tokenReceived(refreshResult.data))
                    // retry the initial query
                    result = await baseQuery(args, api, extraOptions)
                } else {
                    api.dispatch(logout())
                }
            } finally {
                // release must be called once the mutex should be released again.
                release();
            }
        } else {
            // wait until the mutex is available without locking it
            await mutex.waitForUnlock();
            result = await baseQuery(args, api, extraOptions);
        }
    }
    return result
}

export const api = createApi({
    // baseQuery: __DEV__ ? wrapperBaseQuery : orignalBaseQuery,
    baseQuery: baseQueryWithReauth,
    tagTypes: ['Profile', 'KpiMetrics', 'CliPro', 'User'],
    endpoints: () => ({}),
})
