
module.exports = {
    resp: (res, obj, status = 200, payload) => {
        if (typeof obj === 'object') {
            return res.status(status).json(obj)
        } else {
            if (payload) {
                return res.status(status).json({
                    message: obj,
                    payload
                })
            }
            return res.status(status).json({
                message: obj
            })
        }
    },
    removePassword: list => {
        if (!list.length) {
            // Remove password from single user.
            delete list.password;
            return list;
        }
        return list.map(user => {
            delete user.password;
            return user;
        })
    }
}