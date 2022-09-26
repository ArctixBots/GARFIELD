// coded with love by Royce Bob
const axios = require('axios')
const cheerio = require('cheerio')
const fetch = require('node-fetch')
const qs = require("qs")

function upload (media) {
    return new Promise(async (resolve, reject) => {
    try {
        let { ext } = await fromBuffer(media)
        console.log('Uploading image to server telegra.ph')
        let form = new FormData()
        form.append('file', media, 'tmp.' + ext)
        await fetch('https://telegra.ph/upload', {
            method: 'POST',
            body: form
        })
        .then(res => res.json())
        .then(res => {
            if (res.error) return reject(res.error)
            resolve('https://telegra.ph' + res[0].src)
        })
        .catch(err => reject(err))
    } catch (e) {
        return console.log(e)
    }
})
}

function otakudesu(judul){
	return new Promise(async(resolve, reject) => {
	axios.get('https://otakudesu.moe/?s=' + judul + '&post_type=anime')
	.then(({ data }) => {
	const $ = cheerio.load(data)
	const result = {};
	let limk = $('#venkonten > div > div.venser > div > div > ul > li:nth-child(1) > h2 > a').attr('href')
	axios.get(limk).then(({ data }) => {
	const $$ = cheerio.load(data)
	result.message = 'By Hexagon'
	result.img = $$('#venkonten > div.venser > div.fotoanime').find('img').attr('src')
	$$('#venkonten > div.venser > div.fotoanime > div.infozin > div').each(function(a, b) {
		result.judul = $$(b).find('p:nth-child(1)').text().replace('Judul: ','')
		result.jepang = $$(b).find('p:nth-child(2)').text().replace('Japanese: ','')
		result.rate = $$(b).find('p:nth-child(3)').text().replace('Skor: ','')
		result.produser = $$(b).find('p:nth-child(4)').text().replace('Produser: ','')
		result.tipe = $$(b).find('p:nth-child(5)').text().replace('Tipe: ','')
		result.status = $$(b).find('p:nth-child(6)').text().replace('Status: ','')
		result.episode = $$(b).find('p:nth-child(7)').text().replace('Total Episode: ','')
		result.durasi = $$(b).find('p:nth-child(8)').text().replace('Durasi: ','')
		result.rilis = $$(b).find('p:nth-child(9)').text().replace('Tanggal Rilis: ','')
		result.studio = $$(b).find('p:nth-child(10)').text().replace('Studio: ','')
		result.genre = $$(b).find('p:nth-child(11)').text().replace('Genre: ','')
		result.desc = $$('#venkonten > div.venser > div.fotoanime > div.sinopc').text().replace('.','\n') + $$(b).find('div.sinopc > p:nth-child(2)').text()
		result.batch = $$('#venkonten > div.venser > div:nth-child(10) > ul > li > span:nth-child(1) > a').attr('href')
	})
	const lim = $$('#venkonten > div.venser > div:nth-child(10) > ul > li > span:nth-child(1) > a').attr('href')
	axios.get(lim).then(({ data }) => {
	const $$$ = cheerio.load(data)
		result.batchSD = $$$('#venkonten > div:nth-child(6) > ul > li:nth-child(1) > a:nth-child(3)').attr('href')
		result.batchHD = $$$('#venkonten > div:nth-child(6) > ul > li:nth-child(3) > a:nth-child(3)').attr('href')
		resolve(result)
				})
			})
		})
	.catch(reject)
	})
}

function covid(){
	return new Promise(async(resolve, reject) => {
		axios.get('https://covid19.go.id/')
		.then(({ data }) => {
			const $ = cheerio.load(data)
			const hasil = [];
			$('#case > div > div > div > div > div:nth-child(2)').each(function(a,b) {
				const pindo = $(b).find('div:nth-child(3) > strong').text()
				const mindo = $(b).find('div:nth-child(5) > strong').text()
				const sindo = $(b).find('div:nth-child(4) > strong').text()
				const upindo = $(b).find('div.pt-4.text-color-black.text-1').text().trim()
			$('#case > div > div > div > div > div:nth-child(1)').each(function(c,d) {
					const neg = $(d).find('div:nth-child(3) > strong').text() 
					const pglo = $(d).find('div:nth-child(4) > strong').text()
					const nglo = $(d).find('div:nth-child(5) > strong').text()
					const up = $(d).find('div.pt-4.text-color-grey.text-1').text().trim()
				const result = {
					message: 'By Hexagon',
					indo : {
						positif_indo: pindo,
						meninggal_indo: mindo,
						sembuh_indo: sindo,
						update_indo: upindo.split(':')[1]
					},
					global: {
						negara: neg,
						positif: pglo,
						meninggal: nglo,
						update: up.split(':')[1].split('\n')[0]

					}
				}
				hasil.push(result)
				})
			})
			resolve(hasil)
		})
		.catch(reject)
	})
}

function ongoing(){
	return new Promise((reject,resolve) => {
		axios.get('https://otakudesu.moe/ongoing-anime/').then(({ data}) => {
			const $ = cheerio.load(data)
			const result = [];
			const img = [];
			const epz = [];
			const ne = [];
			const th = [];
			const ep = [];
			const nm =[];
			$('div.detpost').each(function(a,b) {
				img.push($(b).find('img').attr('src'))
				nm.push($(b).find('h2').text())
				th.push($(b).find('a').attr('href'))
			})
			$('div.epztipe').each(function(d,c) {
				epz.push($(c).text())
			})
			$('div.newnime').each(function(f,g) {
				ne.push($(g).text())
			})
			$('div.epz').each(function(m,n){
				ep.push($(n).text())
			})
		for( let i = 0; i < img.length; i++){
			result.push({
				nama: nm[i],
				image: img[i],
				episode: ep[i],
				setiap: epz[i],
				rilis: ne[i],
				link: th[i]
			})
		}
		resolve(result)
		})
		.catch(reject)
	})
}

function komiku(judul) {
	return new Promise(async(resolve,reject) => {
	axios.get('https://data3.komiku.id/cari/?post_type=manga&s=' + encodeURIComponent(judul))
	.then(({ data }) => {
	const $ = cheerio.load(data)
	const img = []; 
	const or = [];
	const ind = [];
	const up = [];
	const des = [];
	const li = [];
	const ch = [];
	const ch1 = [];
	$('div.daftar').each(function (a,b) {
		img.push($(b).find('img').attr('data-src'))
	$('div.kan').each(function(c,d) {
		or.push($(d).find('h3').text().trim())
		ind.push($(d).find('span.judul2').text())
		li.push('https://komiku.id' + $(d).find('a').attr('href'))
		up.push($(d).find('p').text().trim().split('. ')[0])
		des.push($(d).find('p').text().trim().split('. ')[1])
		ch1.push($(d).find('div:nth-child(5) > a').attr('title'))
	$('div.new1').each(function(e,f) {
		ch.push($(f).find('a').attr('title'))
		})
	})
})
	for (let i = 0 ; i < img.length; i++) {
		resolve({
			image: img[i],
			title: or[i],
			indo: ind[i],
			update: up[i],
			desc: des[i],
			chapter_awal: ch[i],
			chapter_akhir: ch1[i],
			link: li[i]
		})
	}
})
	.catch(reject)
	})
} 

function tebakgambar() {
	return new Promise(async(resolve, reject) => {
    axios.get('https://jawabantebakgambar.net/all-answers/')
    .then(({ data }) => {
    const $ = cheerio.load(data)
    const result = [];
    let random = Math.floor(Math.random() * 2836) + 2;
    let link2 = 'https://jawabantebakgambar.net'
    $(`#images > li:nth-child(${random}) > a`).each(function(a, b) {
    const img = link2 + $(b).find('img').attr('data-src')
    const jwb = $(b).find('img').attr('alt')
    result.push({
    	message: 'By Hexagon',
    	image: img,
    	jawaban: jwb
    })

    	resolve(result)
    })
    	})
    .catch(reject)
	})
}

function surah2(no){
	return new Promise(async(resolve, reject) => {
		axios.get('https://kalam.sindonews.com/surah/' + no)
		.then(({ data }) => {
			const $ = cheerio.load(data)
			const result = [];
			const ar = [];
			const id = [];
			const lt = [];
			const au = [];
			$('div.breadcrumb-new > ul > li:nth-child(5)').each(function(c,d) {
			result.audio = $(d).find('a').attr('href').replace('surah','audioframe')
			})
			$('div.ayat-arab').each(function(a, b) {
				ar.push($(b).text()) 
			})
			$('li > div.ayat-text').each(function(e, f) {
				id.push($(f).text().replace(',','').trim()) })
			$('div.ayat-latin').each(function(g, h) {
				lt.push($(h).text().trim())	})
			for(let i = 0; i < ar.length ; i++){
			result.push({
				arab: ar[i],
				indo: id[i],
				latin: lt[i],
			})
		}
			resolve(result)
		})
		.catch(reject)
	})
}

function sholat(NOMOR) {
	return new Promise(async(resolve, reject) =>{
		axios.get('https://kalam.sindonews.com/jadwalsholat/' + NOMOR).then(({ data }) => {
			const $ = cheerio.load(data)
			const result = {};
			$('div.imsakiyah-content').each(function(a, b) {
			result.Tanggal = $(b).find('tr:nth-child(1) > td:nth-child(1)').text()
			result.imsak = $(b).find('tr:nth-child(1) > td:nth-child(2)').text()
			result.subuh = $(b).find('tr:nth-child(1) > td:nth-child(3)').text()
			result.zuhur = $(b).find('tr:nth-child(1) > td:nth-child(4)').text()
			result.ashar = $(b).find('tr:nth-child(1) > td:nth-child(5)').text()
			result.maghrib = $(b).find('tr:nth-child(1) > td:nth-child(6)').text()
			result.isya = $(b).find('tr:nth-child(1) > td:nth-child(7)').text()
			})
			resolve(result)
		})
		.catch(reject)
	})
}

function lirik(judul){
	return new Promise(async(resolve, reject) => {
   		axios.get('https://www.musixmatch.com/search/' + judul)
   		.then(async({ data }) => {
   		const $ = cheerio.load(data)
   		const hasil = {};
   		let limk = 'https://www.musixmatch.com'
   		const link = limk + $('div.media-card-body > div > h2').find('a').attr('href')
	   		await axios.get(link)
	   		.then(({ data }) => {
		   		const $$ = cheerio.load(data)
		   		hasil.thumb = 'https:' + $$('div.col-sm-1.col-md-2.col-ml-3.col-lg-3.static-position > div > div > div').find('img').attr('src')
		  		$$('div.col-sm-10.col-md-8.col-ml-6.col-lg-6 > div.mxm-lyrics').each(function(a,b) {
		   hasil.lirik = $$(b).find('span > p > span').text() +'\n' + $$(b).find('span > div > p > span').text()
		   })
	   })
	   resolve(hasil)
   })
   .catch(reject)
   })
}

function chara(query) {
	return new Promise((resolve, reject) => {
		axios.get('https://www.wallpaperflare.com/search?wallpaper='+ query,{
			headers: {
				"user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
				"cookie": "_ga=GA1.2.863074474.1624987429; _gid=GA1.2.857771494.1624987429; __gads=ID=84d12a6ae82d0a63-2242b0820eca0058:T=1624987427:RT=1624987427:S=ALNI_MaJYaH0-_xRbokdDkQ0B49vSYgYcQ"
			}
		})
		.then(({ data }) => {
			const $ = cheerio.load(data)
			const result = [];
			$('#gallery > li > figure > a').each(function(a, b) {
				result.push($(b).find('img').attr('data-src'))
			})
			resolve(result)
		})
	.catch({status: 'err'})
	})
}

function wattpad(judul){
	return new Promise((resolve, reject) => {
		axios.get('https://www.wattpad.com/search/' + judul)
		.then(({data}) => {
			const $ = cheerio.load(data)
			const result = [];
			const jdl = [];
			const img = [];
			const des = [];
			const lnk = [];
			const red = [];
			const vt = [];
			const limk = 'https://www.wattpad.com/'
			$('div.cover.cover-xs.pull-left').each(function(a,b){
				img.push($(b).find('img').attr('src')) 
			})
			$('div.content > h5').each(function(a,b) {
				jdl.push($(b).text().trim())
			})	
			$('div.content > p').each(function(a,b){
				des.push($(b).text().trim())
			})	
			$('#results-stories > div > ul > li').each(function(a,b){
				lnk.push(limk + $(b).find('a.on-result').attr('data-id'))
			})
			$('div.content > div > small.reads').each(function(a,b){
				red.push($(b).text())
			})
			$('div.content > div > small.votes').each(function(a, b) {
				vt.push($(b).text())
			})
		for (let i = 0; i < lnk.length; i++){
			result.push({
					judul: jdl[i],
					desc: des[i],
					vote: vt[i],
					reads: red[i],
					image: img[i],
					link: lnk[i]
			})
			resolve(result)
		}
		})
	.catch({message: 'err'})
	})
}

const telesticker = async (url) => {
    return new Promise(async (resolve, reject) => {
        packName = url.replace("https://t.me/addstickers/", "")
        data = await axios(`https://api.telegram.org/bot891038791:AAHWB1dQd-vi0IbH2NjKYUk-hqQ8rQuzPD4/getStickerSet?name=${encodeURIComponent(packName)}`, {method: "GET",headers: {"User-Agent": "GoogleBot"}})
        const hasil = []
        for (let i = 0; i < data.data.result.stickers.length; i++) {
            fileId = data.data.result.stickers[i].thumb.file_id
            data2 = await axios(`https://api.telegram.org/bot891038791:AAHWB1dQd-vi0IbH2NjKYUk-hqQ8rQuzPD4/getFile?file_id=${fileId}`)
            result = {
            status: 200,
            author: author,
            url: "https://api.telegram.org/file/bot891038791:AAHWB1dQd-vi0IbH2NjKYUk-hqQ8rQuzPD4/" + data2.data.result.file_path
            }
            hasil.push(result)
        }
    resolve(hasil)
    })
}

const stickersearch = (query) => {
    return new Promise((resolve, reject) => {
        axios.get(`https://getstickerpack.com/stickers?query=${query}`)
            .then(({
                data
            }) => {
                const $ = cheerio.load(data)
                const source = [];
                const link = [];
                $('#stickerPacks > div > div:nth-child(3) > div > a').each(function(a, b) {
                    source.push($(b).attr('href'))
                })
                axios.get(source[Math.floor(Math.random() * source.length)])
                    .then(({
                        data
                    }) => {
                        const $$ = cheerio.load(data)
                        $$('#stickerPack > div > div.row > div > img').each(function(c, d) {
                            link.push($$(d).attr('src').replace(/&d=200x200/g,''))
                        })
                        result = {
                            status: 200,
                            author: author,
                            title: $$('#intro > div > div > h1').text(),
                            sticker_url: link
                        }
                        resolve(result)
                    })
            }).catch(reject)
    })
}

function playstore(name){
	return new Promise((resolve, reject) => {
		axios.get('https://play.google.com/store/search?q='+ name +'&c=apps')
		.then(({ data }) => {
			const $ = cheerio.load(data)
			let ln = [];
			let nm = [];
			let dv = [];
			let lm = [];
			const result = [];
			$('div.wXUyZd > a').each(function(a,b){
				const link =  'https://play.google.com' + $(b).attr('href')
				ln.push(link);
			})
			$('div.b8cIId.ReQCgd.Q9MA7b > a > div').each(function(d,e){
				const name = $(e).text().trim()
				nm.push(name);
			})
			$('div.b8cIId.ReQCgd.KoLSrc > a > div').each(function(f,g){
				const dev = $(g).text().trim();
				dv.push(dev)
			})
			$('div.b8cIId.ReQCgd.KoLSrc > a').each(function(h,i){
				const limk = 'https://play.google.com' + $(i).attr('href');
				lm.push(limk);
			})			
		for (let i = 0; i < ln.length; i++){
			result.push({
				name: nm[i],
				link: ln[i],
				developer: dv[i],
				link_dev: lm[i]
			})
	}
		resolve(result)
		})
	.catch(reject)
	})
}

function linkwa(nama){
	return new Promise((resolve,reject) => {
		axios.get('http://ngarang.com/link-grup-wa/daftar-link-grup-wa.php?search='+ nama +'&searchby=name')
		.then(({ data }) => {
			const $ = cheerio.load(data);
			const result = [];
			const lnk = [];
			const nm = [];
		$('div.wa-chat-title-container').each(function(a,b){
			const limk = $(b).find('a').attr('href');
			lnk.push(limk)
			})
		$('div.wa-chat-title-text').each(function(c,d) {
			const name = $(d).text();
			nm.push(name)
			})
		for( let i = 0; i < lnk.length; i++){
			result.push({
				nama: nm[i].split('. ')[1],
				link: lnk[i].split('?')[0]
			})
		}
		resolve(result)
		})
	.catch(reject)
	})
}

const film = (query) => {	
	return new Promise((resolve, reject) => {
		axios.get(`http://167.99.31.48/?s=${query}`)
			.then(({
				data
			}) => {
				const $ = cheerio.load(data)
				const hasil = [];
				$('#content > div > div.los').each(function (a, b) {
                    $(b).find('article').each(function (c, d) {
                        const judul = $(d).find('div > a > div.addinfox > header > h2').text()
                        const quality = $(d).find('div > a > div > div > span').text()
                        const type = $(d).find('div > a > div.addinfox > div > i.type').text()
                        const upload = $(d).find('div > a > div.addinfox > div > span').text()
                        const link = $(d).find('div > a').attr('href');
                        const thumb = $(d).find('div > a > div > img').attr('src');
                        const result = {
                            status: 200,
                        	author: "#𝑿𝑭𝒂𝒓",
                            judul: judul,
                            quality: quality,
                            type: type,
                            upload: upload,
                            link: link,
                            thumb: thumb,
                        };
                        hasil.push(result);
                    });
                });
				resolve(hasil)
			})
			.catch(reject)
	})
}

const anime = (query) => {
    return new Promise((resolve, reject) => {
        axios.get(`https://www.anime-planet.com/anime/all?name=${query}`)
            .then(({
                data
            }) => {
                const hasil = []
                const $ = cheerio.load(data)
                $('#siteContainer > ul.cardDeck.cardGrid > li ').each(function (a, b) {
                        result = {
                            status: 200,
                            author: "#𝑿𝑭𝒂𝒓",
                            judul: $(b).find('> a > h3').text(),
                            link: 'https://www.anime-planet.com' + $(b).find('> a').attr('href'),
                            thumbnail: 'https://www.anime-planet.com' + $(b).find('> a > div.crop > img').attr('src')
                        };
                        hasil.push(result);
                    });
                resolve(hasil)
            })
            .catch(reject)
    })
}

const manga = (query) => {
    return new Promise((resolve, reject) => {
        axios.get(`https://www.anime-planet.com/manga/all?name=${query}`)
            .then(({
                data
            }) => {
                const hasil = []
                const $ = cheerio.load(data)
                $('#siteContainer > ul.cardDeck.cardGrid > li ').each(function (a, b) {
                        result = {
                            status: 200,
                            author: "#𝑿𝑭𝒂𝒓",
                            judul: $(b).find('> a > h3').text(),
                            link: 'https://www.anime-planet.com' + $(b).find('> a').attr('href'),
                            thumbnail: 'https://www.anime-planet.com' + $(b).find('> a > div.crop > img').attr('src')
                        };
                        hasil.push(result);
                    });
                resolve(hasil)
            })
            .catch(reject)
    })
}

const webtoon = (query) => {
    return new Promise((resolve, reject) => {
        axios.get(`https://www.webtoons.com/id/search?keyword=${query}`)
            .then(({
                data
            }) => {
                const $ = cheerio.load(data)
                const hasil = [];
                 $('#content > div.card_wrap.search._searchResult > ul > li ').each(function(a, b) {
                    result = {
                    status: 200,
                    author: author,
                    judul: $(b).find('> a > div > p.subj').text(),
                    like: $(b).find('> a > div > p.grade_area > em').text(),
                    creator: $(b).find('> a > div > p.author').text(),
                    genre: $(b).find('> a > span').text(),
                    thumbnail: $(b).find('> a > img').attr('src'),
                    url: 'https://www.webtoons.com' + $(b).find('> a').attr('href')
                }
                hasil.push(result)
                })
                resolve(hasil)
            })
            .catch(reject)
    })
}

const character = (query) => {
    return new Promise((resolve, reject) => {
        axios.get(`https://www.anime-planet.com/characters/all?name=${query}`)
            .then(({
                data
            }) => {
                const hasil = []
                const $ = cheerio.load(data)
                $('#siteContainer > table > tbody > tr').each(function (a, b) {
                        result = {
                            status: 200,
                            author: "#𝑿𝑭𝒂𝒓",
                            character: $(b).find('> td.tableCharInfo > a').text(),
                            link: 'https://www.anime-planet.com' + $(b).find('> td.tableCharInfo > a').attr('href'),
                            thumbnail: $(b).find('> td.tableAvatar > a > img').attr('src').startsWith('https://') ? $(b).find('> td.tableAvatar > a > img').attr('src') : 'https://www.anime.planet.com' + $(b).find('> td.tableAvatar > a > img').attr('src')
                        };
                        hasil.push(result);
                    });
                resolve(hasil)
            })
            .catch(reject)
    })
}

const jadwalbola = () => {
    return new Promise((resolve, reject) => {
        axios.get('https://m.bola.net/jadwal_televisi/')
            .then(({
                data
            }) => {
                const $ = cheerio.load(data)
                const hasil = [];
                $('#main_mid_headline_sub_topic').each(function(a, b) {
                    result = {
                    status: 200,
                    author: "#𝑿𝑭𝒂𝒓",
                    jadwal: $(b).find(' > div.main_mid_headline_topic > div > a').text(),
                    tanggal: $(b).find(' > div.main_mid_headline_topic_grouped_time_list').text().split('\n')[1].split('                            ')[1],
                    jam: $(b).find(' > div.main_mid_headline_topic > span').text(),
                    url: $(b).find(' > div.main_mid_headline_topic > div > a').attr('href'),
                    thumb: $(b).find(' > div.main_mid_headline_topic > img').attr('src')
                }
                hasil.push(result)
                })
                resolve(hasil)
            })            
            .catch(reject)
    })
}

const jadwaltv = () => {
    return new Promise((resolve, reject) => {
        axios.get('http://www.dokitv.com/jadwal-acara-tv')
            .then(({
                data
            }) => {
                const $ = cheerio.load(data)
                const hasil = [];
                $('#tabeljadwaltv > tbody > tr ').each(function(a, b) {
                    result = {
                    status: 200,
                    author: "#𝑿𝑭𝒂𝒓",
                    acara: $(b).find('> td:nth-child(2)').text(),
                    channel: $(b).find('> td > a').text(),
                    jam: $(b).find('> td.jfx').text(),
                    source: $(b).find('> td > a').attr('href')
                }
                hasil.push(result)
                })
                resolve(hasil)
            })
            .catch(reject)
    })
}

const jadwalsholat = (query) => {
    return new Promise((resolve, reject) => {
        axios.get(`https://umrotix.com/jadwal-sholat/${query}`)
            .then(({
                data
            }) => {
                const $ = cheerio.load(data)
                $('body > div > div.main-wrapper.scrollspy-action > div:nth-child(3) ').each(function(a, b) {   
                    result = {
                    status: 200,
                    author: "#𝑿𝑭𝒂𝒓",
                    tanggal: $(b).find('> div:nth-child(2)').text(),
                    imsyak: $(b).find('> div.panel.daily > div > div > div > div > div:nth-child(1) > p:nth-child(2)').text(),
                    subuh: $(b).find('> div.panel.daily > div > div > div > div > div:nth-child(2) > p:nth-child(2)').text(),
                    dzuhur: $(b).find('> div.panel.daily > div > div > div > div > div:nth-child(3) > p:nth-child(2)').text(),
                    ashar: $(b).find('> div.panel.daily > div > div > div > div > div:nth-child(4) > p:nth-child(2)').text(),
                    maghrib: $(b).find('> div.panel.daily > div > div > div > div > div:nth-child(5) > p:nth-child(2)').text(),
                    isya: $(b).find('> div.panel.daily > div > div > div > div > div:nth-child(6) > p:nth-child(2)').text()
                }
                resolve(result)
                })
            })
            .catch(reject)
    })
}

const drakor = (query) => {
    return new Promise((resolve, reject) => {
        axios.get(`https://drakorasia.blog//?s=${query}&post_type=post`)
            .then(({
                data
            }) => {
                const $ = cheerio.load(data)
                const hasil = [];
                 $('#post > div ').each(function(a, b) {
                    result = {
                    status: 200,
                    author: "#𝑿𝑭𝒂𝒓",
                    judul: $(b).find('> div.title.text-center.absolute.bottom-0.w-full.py-2.pb-4.px-3 > a > h2').text().trim(),
                    years: $(b).find('> div.title.text-center.absolute.bottom-0.w-full.py-2.pb-4.px-3 > div.category.text-gray.font-normal.text-white.text-xs.truncate > a').text(),
                    genre: $(b).find('> div.title.text-center.absolute.bottom-0.w-full.py-2.pb-4.px-3 > div.genrenya.text-center.text-white.text-opacity-75.text-xs.mt-1').text().trim(),
                    thumbnail: $(b).find('> div.thumbnail > a > img').attr('src'),
                    url: $(b).find('> div.title.text-center.absolute.bottom-0.w-full.py-2.pb-4.px-3 > a').attr('href')
                }
                hasil.push(result)
                })
                resolve(hasil)
            })
            .catch(reject)
    })
}

const listsurah = () => {
            return new Promise((resolve, reject) => {
                  axios.get('https://litequran.net/')
                  .then(({ data }) => {
                       const $ = cheerio.load(data)
                       let listsurah = []
                       $('body > main > section > ol > li > a').each(function(a, b) {
                    listsurah.push($(b).text())
                })
                       result = {
                        status: 200,
                        author: "#𝑿𝑭𝒂𝒓",
                        listsurah: listsurah
                       }
                       resolve(result)
                  })
