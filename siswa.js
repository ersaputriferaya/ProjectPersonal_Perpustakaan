const express = require("express")
const router = express.Router()
const db = require("./db")

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
            let sql = "select * from datasiswa where ?"

            // set parameter
            let param = { id_siswa: decryptToken }

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


//--------------------------------- Data Siswa ------------------------------------------

router.get("/datasiswa",validateToken(), (req, res) => {
    let sql = "select * from datasiswa"

    db.query(sql, (error, result) => {
        let response = null
        if(error) {
            response = {
                message: error.message
            }
        } else {
            response = {
                count: result.length,
                datasiswa: result
            }
        }
        res.json(response)
    })
})

router.get("/datasiswa/:id_siswa",validateToken(), (req, res) => {
    let data = {
        id_siswa: req.params.id_siswa
    }
    let sql = "select * from datasiswa where ?"

    db.query(sql, data, (error, result) => {
        let response = null
        if (error) {
            response = {
                message: error.message
            }
        } else {
            response = {
                count: result.length,
                datasiswa: result
            }
        }
        res.json(response)
    })
})

router.post("/datasiswa",validateToken(), (req, res) => {
    let data = {
        nama_siswa: req.body.nama_siswa,
        kelas: req.body.kelas,
        noabsen: req.body.noabsen
    }
    let sql = "insert into datasiswa set ?"

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

router.put("/datasiswa",validateToken(), (req, res) => {
    let data = [
        {
            nama_siswa: req.body.nama_siswa,
            kelas: req.body.kelas,
            noabsen: req.body.noabsen
        },

        {
            id_siswa: req.body.id_siswa
        }
    ]

    let sql = "update datasiswa set ? where ?"

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

router.delete("/datasiswa/:id_siswa",validateToken(), (req, res) => {
    let data = {
        id_siswa: req.params.id_siswa
    }

    let sql = "delete from datasiswa where ?"

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