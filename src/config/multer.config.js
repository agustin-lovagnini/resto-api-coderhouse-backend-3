import fs from 'fs' //? esto es necesario para crear las carpetas de uploads si no existen
import path from 'path' //? esto es necesario para crear las carpetas de uploads si no existen
import multer from 'multer'

const uploadsRoot = 'uploads' //? carpeta raíz para almacenar los archivos subidos

//! Definimos las rutas de las carpetas de uploads para diferentes tipos de archivos
export const uploadFolders = Object.freeze({
    userDocuments: path.join(uploadsRoot, 'users', 'documents'),
    orderReceipts: path.join(uploadsRoot, 'orders', 'receipts')
})

//! Definimos los tipos de archivos permitidos y el tamaño máximo de archivo
const allowedMimeTypes = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'application/pdf'
]

const maxFileSize = 5 * 1024 * 1024

//! Función para asegurarse de que las carpetas de uploads existen, si no existen, se crean
const ensureFolderExists = (folderPath) => {
    if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true })
    }
}

//! Aseguramos que todas las carpetas de uploads existan al iniciar la aplicación
Object.values(uploadFolders).forEach((folderPath) => {
    ensureFolderExists(folderPath)
})

//! Función para crear un almacenamiento personalizado para multer
const createStorage = (destinationFolder) => {
    //! Le decimos a Multer que guarde el archivo en disco, en una carpeta del proyecto
    return multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, destinationFolder) //? Le decimos a Multer que guarde el archivo en la carpeta de destino especificada
        },
        filename: (req, file, cb) => {
            const fileExtension = path.extname(file.originalname)
            const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${fileExtension}`

            cb(null, uniqueName)//? Le decimos a Multer que guarde el archivo con un nombre único para evitar colisiones
        }
    })
}

//! Función para filtrar los archivos subidos según su tipo MIME
const fileFilter = (req, file, cb) => {
    //! chequea que el tipo de archivo sea uno de los permitidos
    if (!allowedMimeTypes.includes(file.mimetype)) {
        return cb(new multer.MulterError('LIMIT_UNEXPECTED_FILE', file.fieldname))
    }

    cb(null, true)
}
//! Configuración de multer para subir documentos de usuario
export const uploadUserDocument = multer({
    storage: createStorage(uploadFolders.userDocuments),
    fileFilter,
    limits: {
        fileSize: maxFileSize,
        files: 1
    }
})

//! Configuración de multer para subir recibos de pedidos
export const uploadOrderReceipt = multer({
    storage: createStorage(uploadFolders.orderReceipts),
    fileFilter,
    limits: {
        fileSize: maxFileSize,
        files: 1
    }
})

//! Exportamos la configuración de multer como un objeto congelado para evitar modificaciones accidentales
export const multerConfig = Object.freeze({
    allowedMimeTypes,
    maxFileSize,
    uploadFolders
})