import should from 'should'
import fs from 'fs'
import { Graph } from '../src'

const newGraph = JSON.parse(
  fs.readFileSync('./test/data1.json')
)

let g = Graph()
g = g.merge(newGraph)

console.log('js', g.toJS())
