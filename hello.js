'use strict'

var minimist = require('minimist')
var path = require('path')

var args = minimist(process.argv.splice(2), {
  alias: {
    greeting: ['g'],
    conf: ['c']
  }
})

var greeting = args.greeting

if (!greeting && args.conf) {
  greeting = require(path.join(process.cwd(), args.conf)).greeting
} else if (!greeting) {
  greeting = 'Hello'
}

console.dir(args)
console.dir(args.something)
console.dir(args.port)
console.log(greeting, args._[0] || 'World')

console.dir(require('./package'))
