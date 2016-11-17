var nextId = 0
var db = {}
var talk = {
  id: nextId++,
  title: 'Muahha',
  speaker: 'Matteo'
}
db[talk.id] = talk
console.log(Object.keys(db).map((id) => db[id]))
