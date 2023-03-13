const express = require("express")
const router = express.Router()
const db = require("./db")

const md5 = require("md5")
const Cryptr = require("cryptr")
const crypt = new Cryptr("087888018379") // secret key

validateToken = () => {
    return (req, res, next) => {
        // cek keberadaan "Token" pada request header
        if (!req.get("Token")) {
            // jika "Token" tidak ada
            res.json({
                message: "Access Forbidden"
            })
        } else {
            // tampung nilai Token
            let token = req.get("Token")

            // decrypt token menjadi id_admin
            let decryptToken = crypt.decrypt(token)

            // sql cek id_admin
            let sql = "select * from dataadmin where ?"

            // set parameter
            let param = { id_admin: decryptToken }

            db.query(sql, param, (error, result) => {
                if (error) throw error
                // cek keberadaan id_admin
                if (result.length > 0) {
                    // id_admin tersedia
                    next()
                } else {
                    // jika admin tidak tersedia
                    res.json({
                        message: "Invalid Token"
                    })
                }
            })
        }
    }
}

//--------------------------------- Data Admin ------------------------------------------

router.get("/dataadmin",validateToken(), (req, res) => {
    let sql = "select * from dataadmin"

    db.query(sql, (error, result) => {
        let response = null
        if (error) {
            response = {
                message: error.message
            }
        } else {
            response = {
                count: result.length,
                dataadmin: result
            }
        }
        res.json(response)
    })
})

router.get("/dataadmin/:id_admin",validateToken(), (req, res) => {
    let data = {
        id_admin: req.params.id_admin
    }
    let sql = "select * from dataadmin where ?"

    db.query(sql, data, (error, result) => {
        let response = null
        if (error) {
            response = {
                message: error.message
            }
        } else {
            response = {
                count: result.length,
                dataadmin: result
            }
        }
        res.json(response)
    })
})

router.post("/dataadmin",validateToken(), (req, res) => {

    let data = {
        nama_admin: req.body.nama_admin,
        username: req.body.username,
        password: md5(req.body.password),
        status: req.body.status
    }
    let sql = "insert into dataadmin set ?"

    db.query(sql, data, (error, result) => {
        let response = null
        if (error) {
            response = {
                message: error.message
            }
        } else {
            response = {
                message: result.affectedRows + " data inserted"
            }
        }
        res.json(response)
    })
})

router.post("/dataadmin/auth", (req, res) => {
    let param = [
        req.body.username,
        md5(req.body.password)
    ]

    let sql = "select * from dataadmin where username = ? and password = ?"

    db.query(sql, param, (error, result) => {
        if (error) throw error

        // cek jumlah data hasil query
        if (result.length > 0) {
            // admin tersedia
            res.json({
                message: "Logged",
                token: crypt.encrypt(result[0].id_admin),
                data: result
            })
        } else {
            // admin tidak tersedia
            res.json({
                message: "Invalid username/password"
            })
        }
    })
})

router.put("/dataadmin",validateToken(), (req, res) => {

    let data = [
        {
            nama_admin: req.body.nama_admin,
            username: req.body.username,
            password: md5(req.body.password),
            status: req.body.status
        },

        {
            id_admin: req.body.id_admin
        }
    ]

    let sql = "update dataadmin set ? where ?"

    db.query(sql, data, (error, result) => {
        let response = null
        if (error) {
            response = {
                message: error.message
            }
        } else {
            response = {
                message: result.affectedRows + " data updated"
            }
        }
        res.json(response)
    })
})

router.delete("/dataadmin/:id_admin",validateToken(), (req, res) => {
    let data = {
        id_admin: req.params.id_admin
    }

    let sql = "delete from dataadmin where ?"

    db.query(sql, data, (error, result) => {
        let response = null
        if (error) {
            response = {
                message: error.message
            }
        } else {
            response = {
                message: result.affectedRows + " data deleted"
            }
        }
        res.json(response)
    })
})

module.exports = router