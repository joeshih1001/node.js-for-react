const jwt = require('jsonwebtoken');


const KEY = 'dfdfdfdfvvvgfghbbg';

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtZW1iZXJfaWQiOjEsIm1lbWJlcl9hY2NvdW50IjoiYjEyMzQ1IiwiaWF0IjoxNjQ2NjQwMDgzfQ.2VZGTXW_HWLvSeRs8ouC2IJCymCgGDrGpigGAVjXDUQ'

const oriData = jwt.verify(token, KEY)

console.log(oriData);
