import { Module } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";
import { Database, Resource, getModelByName } from '@adminjs/prisma'
import AdminJS from "adminjs";

const DEFAULT_ADMIN = {
    email: 'admin@example.com',
    password: 'password',
}

const authenticate = async (email: string, password: string) => {
    if (email === DEFAULT_ADMIN.email && password === DEFAULT_ADMIN.password) {
        return Promise.resolve(DEFAULT_ADMIN)
    }
    return null
}


const usersNavigation = {
    name: 'Users',
    icon: 'User',
}

const prisma = new PrismaClient()

AdminJS.registerAdapter({ Database, Resource })

@Module({
    imports: [
        import('@adminjs/nestjs').then(({ AdminModule }) => AdminModule.createAdminAsync({
            useFactory: () => ({
                adminJsOptions: {
                    rootPath: '/admin',
                    resources: [
                        {
                            resource: {
                                icon: 'User',
                                model: getModelByName('User'),
                                client: prisma,
                            },
                            options: {
                                properties: {
                                    password: {
                                        isVisible: {
                                            edit: false,
                                            show: false,
                                            list: false,
                                            filter: false,
                                        }
                                    }
                                },
                                navigation: usersNavigation,
                            },
                        },
                        {
                            resource: {
                                model: getModelByName('Configure'),
                                client: prisma,
                            },
                        },
                        {
                            resource: {
                                model: getModelByName('Component'),
                                client: prisma,
                            },
                        },
                        {
                            resource: {
                                model: getModelByName('Cart'),
                                client: prisma,
                            },
                        },
                        {
                            resource: {
                                model: getModelByName('Product'),
                                client: prisma,
                            },
                        }
                    ],
                },
                auth: {
                    authenticate,
                    cookieName: 'adminjs',
                    cookiePassword: 'secret'
                },
                sessionOptions: {
                    resave: true,
                    saveUninitialized: true,
                    secret: 'secret'
                },
            }),
        })),
    ],
})

export class AdminModule { }