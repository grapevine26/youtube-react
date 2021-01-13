const express = require('express');
const router = express.Router();
const {Video} = require("../models/Video");
const multer = require("multer");
const path = require('path');
var ffmpeg = require('fluent-ffmpeg');


var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/')
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}_${file.originalname}`)
    },
    fileFilter: (req, file, cb) => {
        const ext = path.extname(file.originalname)
        if (ext !== '.mp4') {
            return cb(res.status(400).end('only jpg, png, mp4 is allowed'), false);
        }
        cb(null, true)
    }
})

var upload = multer({storage: storage}).single("file")


//=================================
//             Video
//=================================

router.post("/uploadfiles", (req, res) => {
    // 서버에 비디오 업로드
    upload(req, res, err => {
        if (err) {
            return res.json({success: false, err})
        }
        return res.json({success: true, url: res.req.file.path, fileName: res.req.file.filename})
    })
});

router.post("/uploadVideo", (req, res) => {
    // 비디오 정보 저장
    const video = new Video(req.body)
    video.save((err, doc) => {
        if (err) return res.json({success: false, err})
        res.status(200).json({success: true})
    })

});

router.get("/getVideos", (req, res) => {
    // 비디오 가져오기
    Video.find()
        .populate("writer")
        .exec((err, videos) => {
            if (err) return res.status(400).send(err);
            res.status(200).json({success: true, videos})
        })
});

router.post("/getVideoDetail", (req, res) => {
    // 비디오 가져오기
    Video.findOne({"_id": req.body.videoId})
        .populate("writer")
        .exec((err, videoDetail) => {
            if (err) return res.status(400).send(err);
            res.status(200).json({success: true, videoDetail})
        })
});

router.post("/thumbnail", (req, res) => {
    // 썸네일 생성,저장 및 비디오 러닝타임 가져오기

    let filePath = ""
    let fileDuration = ""

    // 비디오 정보 가져오기
    ffmpeg.ffprobe(req.body.url, function (err, metadata) {
        console.dir(metadata);
        console.log(metadata.format.duration);
        fileDuration = metadata.format.duration;
    })

    // 썸네일 생성
    ffmpeg(req.body.url)
        .on('filenames', function (filenames) {
            console.log('Will generate ' + filenames.join(', '));
            console.log(filenames);

            filePath = "uploads/thumbnails/" + filenames[0]
        })
        .on('end', function () {
            console.log('Screenshots taken');
            return res.json({success: true, url: filePath, fileDuration: fileDuration})
        })
        .on('error', function (err) {
            console.error(err);
            return res.json({success: false, err})
        })
        .screenshot({
            count: 3,
            folder: 'uploads/thumbnails',
            size: '320x240',
            filename: 'thumbnail-%b.png'
        })
});

module.exports = router;
