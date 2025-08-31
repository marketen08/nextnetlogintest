"use client";

// ** UI imports
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Icons } from "@/components/icons"
import { cn, decodeJWT } from "@/lib/utils"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"

// ** Custom components
import { AlertError } from "@/components/alerts"

// // ** React router imports
// import { Link } from "react-router";

// ** Redux imports
import { useLoginMutation, useLoginGoogleMutation, useLoginMicrosoftMutation } from "@/store/services/auth";
import { useAppDispatch } from "@/store/hooks"
import { tokenReceived } from "@/store/features/user"

// ** React hook form imports
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

// ** Google login import
import { useGoogleLogin, GoogleLogin } from "@react-oauth/google";
import Link from "next/link"
import { useRouter } from "next/navigation";
import { microsoftLogin } from "@/lib/msalConfig";

const formSchema = z.object({
    email: z.string({ message: "El email es requerido" }).email("No es un email válido"),
    password: z.string({ message: "La contraseña es requerida" }).min(6, "La contraseña debe tener al menos 6 caracteres")
});

const Login = () => {
    const router = useRouter();
    
    // Redux
    const [loginAPI, { isLoading: isLoadingLogin }] = useLoginMutation();
    const [loginGoogleAPI, { isLoading: isLoadingGoogle }] = useLoginGoogleMutation();
    const [loginMicrosoftAPI, { isLoading: isLoadingMicrosoft }] = useLoginMicrosoftMutation();
    const isLoading = isLoadingLogin || isLoadingGoogle || isLoadingMicrosoft;
    const dispatch = useAppDispatch();

    // Hooks
    const googleLogin = useGoogleLogin({
        onSuccess: (codeResponse) => {
            console.log(codeResponse);
            googleLoginHandler({ code: codeResponse.code });
        },
        flow: 'auth-code'
    });

    // ** Hooks
    const form = useForm<z.infer<typeof formSchema>>({
        mode: 'onSubmit',
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: 'admin@admin.com',
            password: 'Admin123456'
        },
    })

    // ** Handlers
    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        form.clearErrors('root.serverError'); // Clear previous server errors
        try {
            const email = data.email.trim();
            const password = data.password;
            const res = await loginAPI({
                email,
                password
            }).unwrap()

            console.log({ res })

            dispatchToken(res);
        } catch (error) {
            console.error('Login error details:', error)
            
            // Más información del error para debugging
            if (error && typeof error === 'object' && 'data' in error) {
                console.error('Error data:', error.data);
            }
            if (error && typeof error === 'object' && 'status' in error) {
                console.error('Error status:', error.status);
            }
            
            form.setError('root.serverError', { 
                type: 'server', 
                message: error && typeof error === 'object' && 'status' in error && error.status === 'FETCH_ERROR' 
                    ? "No se puede conectar con el servidor. Verifique que el servidor esté ejecutándose en http://localhost:7182" 
                    : "Credenciales inválidas" 
            });
        }
    };

    const googleLoginHandler = async (props: object) => {
        try {
            console.log(props, '<-- props');
            const res = await loginGoogleAPI(props).unwrap();
            //console.log({ res })

            dispatchToken(res);
        } catch (error) {
            console.error(error);
        }
    }

        // ** Microsoft login handler
    const microsoftLoginHandler = async () => {
        try {
            const microsoftResponse = await microsoftLogin();  // Llama a la función para login de Microsoft

            if (microsoftResponse) {
                console.log(microsoftResponse, '<-- microsoftResponse');
                const res = await loginMicrosoftAPI(microsoftResponse).unwrap();
                console.log({ res }, 'microsoft')
                dispatchToken(res);
            }
        } catch (error) {
            console.error("Error en el login de Microsoft:", error);
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const dispatchToken = (res: any) => {
        const jwt = decodeJWT(res.accessToken);
        dispatch(tokenReceived({ ...res, email: jwt.email, roles: jwt.roles }));
        
        // Redirigir al dashboard después del login exitoso
        router.push('/dashboard');
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
            <Card className={cn("w-full max-w-md")} >
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold text-center">Bienvenido</CardTitle>
                    <CardDescription className="text-center">Seleccione su correo electrónico para iniciar sesión</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <GoogleLogin
                            onSuccess={(res) => {
                                console.log(res);
                                googleLoginHandler({ id_token: res.credential });
                            }}
                            onError={() => console.error('Error')}
                        />
                        <Button variant="outline" type="button" disabled={isLoading} className="w-full" onClick={googleLogin}>
                            {isLoading ? (
                                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                                <Icons.google className="mr-2 h-4 w-4" />
                            )}{" "}
                            Continue con Google
                        </Button>
                    </div>

                    {/* Microsoft login button */}
                    <Button variant="outline" type="button" disabled={isLoading} className="w-full" onClick={microsoftLoginHandler}>
                        {isLoading ? (
                            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                            <Icons.google className="mr-2 h-4 w-4" />
                        )}{" "}
                        Continue con Microsoft
                    </Button>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-background px-2 text-muted-foreground">Email y contraseña</span>
                        </div>
                    </div>
                    <Form {...form} >
                        <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Email</FormLabel>
                                                <FormControl>
                                                    <Input type="email" placeholder="example@domain.com" {...field} disabled={isLoading} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <FormField
                                        control={form.control}
                                        name="password"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Contraseña</FormLabel>
                                                <FormControl>
                                                    <Input type="password" {...field} disabled={isLoading} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>)}
                                    />
                                </div>
                                <Button className="w-full" type="submit" disabled={isLoading}>
                                    {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
                                    Iniciar sesión
                                </Button>
                            </div>
                        </form>
                        <AlertError error={form.formState.errors['root']?.['serverError']?.message} />
                    </Form>
                </CardContent>
                <CardFooter className="flex flex-wrap items-center justify-between gap-2">
                    <div className="text-sm text-muted-foreground">
                        <span className="mr-1">¿No tiene una cuenta?</span>
                        <Link aria-label="Registrese" href="/register" className="text-primary underline-offset-4 hover:underline">
                            Registrese
                        </Link>
                    </div>
                </CardFooter>
            </Card>
        </div>)
}

export default Login