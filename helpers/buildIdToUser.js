const buildIdToUser = users => users.reduce((idToUser, user) => {
    idToUser[user.id] = user
    return idToUser
}, {})

export default buildIdToUser