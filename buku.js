const express = require("express")
const router = express.Router()
const db = require("./db")

const multer = require("multer")
const path = require("path")
const fs = require("fs") 

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './image')
    },
    filename: (req, file, cb) => {
        cb(null, "image-"+ Date.now() + path.extname(file.originalname))
    }
})

let upload = multer({storage: storage})

//--------------------------------- Data Buku ------------------------------------------

router.get("/databuku", (req, res) => {
    let sql = "select * from databuku"

    db.query(sql, (error, result) => {
        let response = null
        if (error) {
            response = {
                message: error.message
            }
        } else {
            response = {
                count: result.length,
                databuku: result
            }
        }
        res.json(response)
    })
})

router.get("/databuku/:id_buku", (req, res) => {
    let data = {
        id_buku: req.params.id_buku
    }
    let sql = "select * from databuku where ?"

    db.query(sql, data, (error, result) => {
        let response = null
        if (error) {
            response = {
                message: error.message
            }
        } else {
            response = {
                count: result.length,
                databuku: result
            }
        }
        res.json(response)
    })
})

router.post("/databuku", upload.single("image"), (req, res) => {
    let data = {
        judul_buku: req.body.judul_buku,
        jumlah_halaman_buku: req.body.jumlah_halaman_buku,
        keterangan_kondisi_buku: req.body.keterangan_kondisi_buku,
        image: req.file.filename
    }

    if (!req.file) {
        res.json({
            message: "Tidak ada file yang dikirim"
        })
    } else {
        let sql = "insert into databuku set ?"

        db.query(sql, data, (error, result) => {
            if (error) throw error

            res.json({
                message: result.affectedRows + " data berhasil disimpan"
            })
        })
    }
})

router.put("/databuku", upload.single("image"), (req, res) => {
    let data = null, sql = null
    let param = { id_buku: req.body.id_buku }

    if (!req.file) {
        data = {
            judul_buku: req.body.judul_buku,
            jumlah_halaman_buku: req.body,jumlah_halaman_buku,
            keterangan_kondisi_buku: req.body.keterangan_kondisi_buku
        }
    } else {
        data = {
            judul_buku: req.body.judul_buku,
            jumlah_halaman_buku: req.body.jumlah_halaman_buku,
            keterangan_kondisi_buku: req.body.keterangan_kondisi_buku,
            image: req.file.filename
        }

        sql = " select * from databuku where ?"

        db.query(sql, param, (err, result) => {
            if (error) throw error

            let fileName = result[0].image

            let dir = path.join(__dirname,"image", fileName)
            fs.unlink(dir, (error) => {})
        })
    }

    sql = "update databuku set ? where ?"

    db.query(sql, [data, param], (error, result) => {
        if (error) {
            res.json({
                message: error.message
            })
        } else {
            res.json({
                message: result.affectedRows + " data berhasil diubah"
            })
        }
    })
})

router.delete("/databuku/:id_buku", (req, res) => {
    let param = { id_buku: req.params.id_buku }

    let sql = "select * from databuku where ?"

    db.query(sql, param, (error, result) => {
        if (error) throw error

        let fileName = result[0].image

        let dir = path.join(__dirname,"image",fileName)
        fs.unlink(dir, (error) => {})
    })

    sql = "delete from databuku where ?"

    db.query(sql, param, (error, result) => {
        if (error) {
            res.json({
                message: error.message
            })
        } else {
            res.json({
                message: result.affectedRows + " data berhasil dihapus"
            })
        }
    })
})

module.exports = router