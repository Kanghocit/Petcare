export const verifyRole = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user || !allowedRoles.include(req.user.role)) {
            return res.status(403).json({ ok: false, message: "Access denied" })
        }
        next()
    }
}