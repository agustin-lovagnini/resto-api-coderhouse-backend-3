import swaggerJsdoc from 'swagger-jsdoc' //? generar la documentacion de la API en formato OpenAPI

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Resto API',
            version: '1.0.0',
            description:
                'API de restaurante para gestionar usuarios, productos, empleados, pedidos, datos mock y validacion del logger.'
        },
        servers: [
            {
                url: 'http://localhost:8080',
                description: 'Servidor local'
            }
        ],
        tags: [
            {
                name: 'Users',
                description: 'Gestion de usuarios del sistema.'
            },
            {
                name: 'Products',
                description: 'Gestion de productos del menu.'
            },
            {
                name: 'Employees',
                description: 'Gestion de empleados del restaurante.'
            },
            {
                name: 'Orders',
                description: 'Gestion de pedidos del restaurante.'
            },
            {
                name: 'Mocks',
                description: 'Generacion e insercion de datos de prueba.'
            },
            {
                name: 'Logger',
                description:
                    'Endpoint de validacion del sistema de logs. No pertenece a la logica de negocio.'
            }
        ],
        components: {
            schemas: {
                User: {
                    type: 'object',
                    properties: {
                        _id: {
                            type: 'string',
                            example: '64f8a8c2b9a1f23d45678910'
                        },
                        nombre: {
                            type: 'string',
                            example: 'Juan'
                        },
                        apellido: {
                            type: 'string',
                            example: 'Perez'
                        },
                        email: {
                            type: 'string',
                            example: 'juan.perez@mail.com'
                        },
                        rol: {
                            type: 'string',
                            enum: ['ADMIN', 'USUARIO'],
                            example: 'USUARIO'
                        },
                        createdAt: {
                            type: 'string',
                            format: 'date-time'
                        },
                        updatedAt: {
                            type: 'string',
                            format: 'date-time'
                        }
                    }
                },
                Product: {
                    type: 'object',
                    properties: {
                        _id: {
                            type: 'string',
                            example: '64f8a8c2b9a1f23d45678911'
                        },
                        nombre: {
                            type: 'string',
                            example: 'Hamburguesa completa'
                        },
                        descripcion: {
                            type: 'string',
                            example: 'Hamburguesa con queso, lechuga, tomate y papas.'
                        },
                        categoria: {
                            type: 'string',
                            enum: ['ENTRADAS', 'PLATOS_PRINCIPALES', 'POSTRES', 'BEBIDAS'],
                            example: 'PLATOS_PRINCIPALES'
                        },
                        precio: {
                            type: 'number',
                            example: 8500
                        },
                        stock: {
                            type: 'number',
                            example: 25
                        },
                        estado: {
                            type: 'string',
                            enum: ['DISPONIBLE', 'SIN_STOCK', 'DISCONTINUADO'],
                            example: 'DISPONIBLE'
                        },
                        createdAt: {
                            type: 'string',
                            format: 'date-time'
                        },
                        updatedAt: {
                            type: 'string',
                            format: 'date-time'
                        }
                    }
                },
                Employee: {
                    type: 'object',
                    properties: {
                        _id: {
                            type: 'string',
                            example: '64f8a8c2b9a1f23d45678912'
                        },
                        nombre: {
                            type: 'string',
                            example: 'Laura'
                        },
                        apellido: {
                            type: 'string',
                            example: 'Gomez'
                        },
                        email: {
                            type: 'string',
                            example: 'laura.gomez@resto.com'
                        },
                        telefono: {
                            type: 'string',
                            example: '1122334455'
                        },
                        puesto: {
                            type: 'string',
                            enum: ['MOZO', 'COCINERO', 'CAJERO', 'ENCARGADO'],
                            example: 'MOZO'
                        },
                        activo: {
                            type: 'boolean',
                            example: true
                        },
                        createdAt: {
                            type: 'string',
                            format: 'date-time'
                        },
                        updatedAt: {
                            type: 'string',
                            format: 'date-time'
                        }
                    }
                },
                OrderProduct: {
                    type: 'object',
                    properties: {
                        producto: {
                            type: 'string',
                            example: '64f8a8c2b9a1f23d45678911'
                        },
                        cantidad: {
                            type: 'number',
                            example: 2
                        },
                        precioUnitario: {
                            type: 'number',
                            example: 8500
                        },
                        subtotal: {
                            type: 'number',
                            example: 17000
                        }
                    }
                },
                Order: {
                    type: 'object',
                    properties: {
                        _id: {
                            type: 'string',
                            example: '64f8a8c2b9a1f23d45678913'
                        },
                        mesa: {
                            type: 'number',
                            example: 4
                        },
                        empleado: {
                            type: 'string',
                            example: '64f8a8c2b9a1f23d45678912'
                        },
                        productos: {
                            type: 'array',
                            items: {
                                $ref: '#/components/schemas/OrderProduct'
                            }
                        },
                        estado: {
                            type: 'string',
                            enum: [
                                'PENDIENTE',
                                'EN_PREPARACION',
                                'LISTO',
                                'ENTREGADO',
                                'CANCELADO'
                            ],
                            example: 'PENDIENTE'
                        },
                        total: {
                            type: 'number',
                            example: 17000
                        },
                        observaciones: {
                            type: 'string',
                            example: 'Sin cebolla'
                        },
                        createdAt: {
                            type: 'string',
                            format: 'date-time'
                        },
                        updatedAt: {
                            type: 'string',
                            format: 'date-time'
                        }
                    }
                },
                SuccessResponse: {
                    type: 'object',
                    properties: {
                        status: {
                            type: 'string',
                            example: 'success'
                        },
                        payload: {
                            type: 'object'
                        }
                    }
                },
                ErrorResponse: {
                    type: 'object',
                    properties: {
                        status: {
                            type: 'string',
                            example: 'error'
                        },
                        code: {
                            type: 'string',
                            example: 'VALIDATION_ERROR'
                        },
                        message: {
                            type: 'string',
                            example: 'Los datos enviados no son validos'
                        },
                        details: {
                            type: 'object',
                            nullable: true
                        }
                    }
                }
            }
        }
    },
    apis: ['./src/routes/*.js'] //? Archivos donde se encuentran los endpoints de la API
}

export const swaggerSpecs = swaggerJsdoc(swaggerOptions)