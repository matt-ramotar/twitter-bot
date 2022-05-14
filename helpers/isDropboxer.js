const DROPBOXER = "dropbox"

const isDropboxer = user => user.description.toLowerCase().includes(DROPBOXER)

export default isDropboxer

