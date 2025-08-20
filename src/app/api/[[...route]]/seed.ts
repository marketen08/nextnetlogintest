import { z } from "zod";
import { Hono } from "hono";
// import { clerkMiddleware, getAuth } from "@hono/clerk-auth";

// import db from '@/lib/db';
import { zValidator } from '@hono/zod-validator';
// import { CategorySchema } from "@/features/categories/schema";

const app = new Hono()
    .get(
        "/", 
        // clerkMiddleware(),
        async (c) => {
            // const auth = getAuth(c);
 
            // if (!auth?.userId){
            //     return c.json({ error: "unauthorized" }, 401);
            // }

            // await db.transaction.deleteMany();
            // await db.account.deleteMany();
            // await db.category.deleteMany();
          
            const user1Id = 'user_2jcfifEM3H6B4mlzvNwaSWQVImD';
            const user2Id = 'user_2jcfifEM3H6B4mlzvNwaSWQVImD';

            // Crear cuentas
            // const account1 = await db.account.create({
            //     data: {
            //     name: 'Cuenta Corriente',
            //     userId: user1Id,
            //     },
            // });

            // const account2 = await db.account.create({
            //     data: {
            //     name: 'Cuenta de Ahorro',
            //     userId: user2Id,
            //     },
            // });

                        
            // Crear categorías
            // const category1 = await db.category.create({
            //     data: {
            //     name: 'Alimentación',
            //     userId: user1Id,
            //     },
            // });

            // const category2 = await db.category.create({
            //     data: {
            //     name: 'Transporte',
            //     userId: user2Id,
            //     },
            // });

            

            // Crear transacciones
            // const transactions = await db.transaction.createMany({
            //     data: [
            //         {
            //             amount: 100000,
            //             payee: 'Supermercado XYZ',
            //             date: new Date('2024-12-01'),
            //             notes: 'Compra de comestibles',
            //             accountId: account1.id,
            //             categoryId: category1.id,
            //         },
            //         {
            //             amount: 120000,
            //             payee: 'Gasolinera ABC',
            //             date: new Date('2024-12-05'),
            //             notes: 'Combustible',
            //             accountId: account2.id,
            //             categoryId: category2.id,
            //         },
            //         {
            //             amount: 130000,
            //             payee: 'Restaurante DEF',
            //             date: new Date('2024-12-10'),
            //             accountId: account1.id,
            //         },
            //         {
            //             amount: -50000,
            //             payee: 'Restaurante DEF',
            //             date: new Date('2024-12-10'),
            //             accountId: account1.id,
            //         },
            //         {
            //             amount: 225000,
            //             payee: 'Gasolinera ABC',
            //             date: new Date('2024-12-20'),
            //             notes: 'Combustible',
            //             accountId: account2.id,
            //             categoryId: category2.id,
            //         },
            //         {
            //             amount: 140500,
            //             payee: 'Gasolinera ABC',
            //             date: new Date('2024-12-20'),
            //             notes: 'Combustible',
            //             accountId: account2.id,
            //             categoryId: category2.id,
            //         },
            //     ],
            // });

            // console.log('Seed realizado con exito en la base de datos!');

            // const data = {
            //     account1,
            //     account2,
            //     category1,
            //     category2,
            //     transactions,
            // }
            return c.json({ data: 'Seed realizado con exito en la base de datos!' });
    });

export default app;