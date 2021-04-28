export function uploadSecretAttachments(userId: number, secretId: number, dateCreatedMillis:  number, attachments: string[]) {
    // handle attachments
    return [userId + '/' + secretId + '_' + dateCreatedMillis + '_' + 'path_to_uploaded_file.ext'];
}