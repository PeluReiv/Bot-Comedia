import { createHash } from 'crypto'
//import { max } from 'lodash'
let Reg = /\|?(.*)([.|] *?)([0-9]*)$/i
let data = {}
async function handler(m, { conn, text, usedPrefix, command }) {
let resp = '', consola
const bot = global.db.data.bot[conn.user.jid]
const chats = bot.chats || {}
const privs = chats.privs || {}
const groups = chats.groups || {}
const chat = m.isGroup ? groups[m.chat] || {} : privs[m.chat] || {}
const users = m.isGroup ? chat.users || {} : privs || {}
let user = m.isGroup ? users[m.sender] || {} : privs[m.sender] || {}
let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender
if (m.fromMe) return
let name2 = await conn.getName(who)
if (user.registered === true) {
resp = `*[❗INFO❗] HEY! YA ESTÁS REGISTRADO*\n\n*QUIERES QUITAR TU REGISTRO? USA EL COMANDO ${usedPrefix}unreg <numero de serie>*\n\n*SI NO RECUERDAS TU NÚMERO DE SERIE PUEDES USAR EL COMANDO ${usedPrefix}myns*`
} else {
if (!m.text || !Reg.test(m.text)) {
resp = `*[❗INFO❗] FORMATO INCORRECTO*\n\n*—◉ USO DEL COMANDO: ${usedPrefix + command} nombre.edad*\n*—◉ Ejemplo: ${usedPrefix + command} ${name2.replace(' ', '')}.18*`
} else {
let [_, name, splitter, age] = m.text.match(Reg)
data[name2] = {
name2,
_,
name,
splitter,
age,
user,
timeout: setTimeout(async () => {
resp = 'Se acabó el tiempo'
delete confirmations[m.sender]}, 60 * 1000)
}
/**/
}
return conn.sendWritingText(m.chat, resp, m );
}
}
handler.help = ['verificar']
handler.tags = ['xp']
handler.command = /^(verify|register|verificar|reg|registrar)$/i
handler.before = async function before(m, {conn}) {
const datos = Object.values(data).find(c => c.name2)
console.log('verificar: ', m.text.match(Reg), data, datos)
if (!data && m.fromMe) return
let {name2, _, name, splitter, age, user} = data
//await conn.sendWritingText(m.chat, `Deseas que use tu nickname como nombre o prefieres el que has elegido, contesta si, de lo contrario contesta no`, m );
if (/si/i.test(m.text.toLowerCase())) {
name = name2
} else if (/no/.test(m.text.toLowerCase())) {
name = name
}

//`${text.match(Reg)}`, splitter, age, user.registered, nombre
const nombre = name.replace(`${usedPrefix+command} `, '')[0]
if (!nombre) {
resp = '*[❗INFO❗] DEBES PONER UN NOMBRE*'
return conn.sendWritingText(m.chat, resp, m );
}
if (!age) {
resp = '*[❗INFO❗] LA EDAD NO PUEDE ESTAR VACIA*'
return conn.sendWritingText(m.chat, resp, m );
}
if (nombre.length >= 30) {
resp = '[❗INFO❗] EL NOMBRE ES DEMACIADO LARGO' 
return conn.sendWritingText(m.chat, resp, m );
}
if (nombre.length <= 1) {
resp = '[❗INFO❗] EL NOMBRE ES DEMACIADO CORTO'
return conn.sendWritingText(m.chat, resp, m );
} 
age = parseInt(age)
if (age > 100) {
resp = '*[❗] Kheee, como sigues vivo con esa edad? 👴🏻*'
return conn.sendWritingText(m.chat, resp, m );
}
if (age < 5) {
resp = '*[❗] Kheee, un bebé que sabe usar WhatsApp? 😲*'
return conn.sendWritingText(m.chat, resp, m );
} 
user.name = nombre
user.age = age
user.regTime = + new Date
user.registered = true
let sn = createHash('md5').update(m.sender).digest('hex')
resp = `\n\n¡¡AHORA TE HE REGISTRADO!!\n\n┏┅ ━━━━━━━━━━━━ ┅ ━
┇「 INFORMACIÓN 」
┣┅ ━━━━━━━━━━━━ ┅ ━
┃ *NOMBRE:* ${name}
┃ *EDAD:* ${age} años
┃ *NÚMERO DE SERIE:* 
┃ ${sn}
┗┅ ━━━━━━━━━━━━ ┅ ━\n\n¡TU NÚMERO DE SERIE TE SERVIRÁ TÚ POR SI DESEAS BORRAR TU REGISTRO DEL BOT ${wm}!\nPara corroborar tu informacion usa:\n'${usedPrefix}profile y si quieres tu numero de serie agrega al comando la frase "numero de serie"` 
user.money += 10000
user.exp += 10000
}
export default handler
