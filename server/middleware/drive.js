require('dotenv').config();
const { google } = require('googleapis');
const stream = require('stream');

const CLIENT_ID = process.env.CLIENT_ID_DRIVE_DEV || process.env.CLIENT_ID_DRIVE;
const CLIENT_SECRET = process.env.CLIENT_SECRET_DRIVE_DEV || process.env.CLIENT_SECRET_DRIVE;
const REDIRECT_URI = process.env.REDIRECT_URI_DRIVE;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN_DRIVE_DEV || process.env.REFRESH_TOKEN_DRIVE;
const FOLDER_DRIVE = process.env.FOLDER_DRIVE_DEV || process.env.FOLDER_DRIVE;
const oauth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });
const drive = google.drive({
    version: 'v3',
    auth: oauth2Client
});

var that = module.exports = {
    setFilePublic: async (fileId) => {
        try {
            await drive.permissions.create({
                fileId: fileId,
                requestBody: {
                    role: 'reader',
                    type: 'anyone'
                }
            });
        } catch (e) {
            console.log(e.message);
        }
    },
    uploadFile: async (fileObject, { shared }) => {
        try {
            const bufferStream = new stream.PassThrough();
            bufferStream.end(fileObject.buffer);
            const createFile = await drive.files.create({
                requestBody: {
                    name: fileObject.originalname,
                    mimeType: fileObject.mimeType,
                    parents: [FOLDER_DRIVE]
                },
                media: {
                    mimeType: fileObject.mimeType,
                    body: bufferStream
                }
            });
            if (shared) {
                const fileId = createFile.data.id;
                await that.setFilePublic(fileId);
                return fileId;
            }
        } catch (e) {
            console.log(e.message);
        }
    },
    deleteFile: async (fileId) => {
        try {
            await drive.permissions.create({
                fileId: fileId,
                requestBody: {
                    role: 'writer',
                    type: 'anyone'
                }
            });
            await drive.files.delete({
                fileId: fileId
            })
        } catch (e) {
            console.log(e.message);
        }
    }
}