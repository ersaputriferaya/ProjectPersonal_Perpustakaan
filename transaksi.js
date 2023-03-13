const express = require("express")
const router = express.Router()
const db = require("./db")
const moment = require("moment")

//---------------------------------------------- Transaksi ------------------------------------------------------

router.post("/peminjaman_buku", (req, res) => {
    let data = {
        id_siswa: req.body.id_siswa,
        id_admin: req.body.id_admin,
        tanggal_pinjam: moment().format('YYYY-MM-DD HH:mm:ss'),
        tanggal_kembali: req.body.tanggal_kembali,
        denda: req.body.denda
    }

    let peminjaman = JSON.parse(req.body.peminjaman)

    let sql = "insert into peminjaman_buku set ?"

    //run query
    db.query(sql, data, (error, result) => {
        let response = null

        if (error) {
            res.json({ message: error.message })
        } else {

            let lastID = result.insertId

            let data = []
            for (let index = 0; index < peminjaman.length; index++) {
                data.push([
                    lastID, peminjaman[index].id_buku
                ])
            }
            let sql = "insert into detail_peminjaman_buku values ?"

            db.query(sql, [data], (error, result) => {
                if (error) {
                    res.json({ message: error.message })
                } else {
                    res.json({ message: "Data has been inserted" })
                }
            })
        }
    })
})

router.get("/peminjaman_buku", (req, res) => {
    //create sql query
    // let sql = "select peminjaman_buku.id_peminjaman_buku, peminjaman_buku.tanggal_pinjam, peminjaman_buku.id_siswa, peminjaman_buku.id_admin, peminjaman_buku.tanggal_kembali, peminjaman_buku.denda, dataadmin.id_admin, dataadmin.nama_admin, dataadmin.status, datasiswa.id_siswa, datasiswa.nama_siswa from peminjaman_buku peminjaman_buku join dataadmin dataadmin on peminjaman_buku.id_admin = dataadmin.id_admin join datasiswa datasiswa on peminjaman_buku.id_siswa = datasiswa.id_siswa" 
    let sql = "select p.id_peminjaman_buku, p.tanggal_pinjam, p.id_siswa, p.id_admin, p.tanggal_kembali, p.denda, a.id_admin, a.nama_admin, a.username, a.password, a.status, s.id_siswa, s.nama_siswa from peminjaman_buku p join dataadmin a on p.id_admin = a.id_admin join datasiswa s on p.id_siswa = s.id_siswa"
    //run query
    db.query(sql, (error, result) => {
        if (error) {
            res.json({ message: error.message })
        } else {
            res.json({
                count: result.length,
                peminjaman_buku: result
            })
        }
    })
})

router.get("/peminjaman_buku/:id_peminjaman_buku", (req,res) => {
    let param = { id_peminjaman_buku: req.params.id_peminjaman_buku }

    // create sql query
    let sql = "select p.judul_buku, p.jumlah_halaman_buku " + 
    "from detail_peminjaman_buku dps join databuku p "+
    "on p.id_buku = dps.id_buku " +
    "where ?"

    db.query(sql, param, (error, result) => {
        if (error) {
            res.json({ message: error.message})   
        }else{
            res.json({
                count: result.length,
                detail_peminjaman_buku: result
            })
        }
    })
})

//end point untuk menghapus data pelanggaran_siswa
router.delete("/peminjaman_buku/:id_peminjaman_buku", (req, res) => {
    let param = { id_peminjaman_buku: req.params.id_peminjaman_buku }

    //create sql query delete detail_pelanggaran
    let sql = "delete from detail_peminjaman_buku where ?"

    db.query(sql, param, (error, result) => {
        if (error) {
            res.json({ message: error.message })
        } else {
            let param = { id_peminjaman_buku: req.params.id_peminjaman_buku }

            //create sql query delete pelanggaran_siswa
            let sql = "delete from peminjaman_buku where ?"

            db.query(sql, param, (error, result) => {
                if (error) {
                    res.json({ message: error.message })
                } else {
                    res.json({ message: "Data has been deleted" })
                }
            })
        }
    })
})

module.exports = router