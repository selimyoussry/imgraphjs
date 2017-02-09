import should from 'should'
import { Graph } from '../src'

let g = Graph()
g = g.mergeNode('node.1', {
  prop1: 120,
  prop2: 'hello'
})
g = g.mergeNode('node.2', {
  prop1: 130,
  prop2: 'hallo'
})
g = g.mergeEdge('a.b', {prop3: true}, 'is_friend', 'node.1', 'node.2')
g = g.mergeNode('node.2', {
  prop2: 'hullo'
})
g = g.mergeEdge('a.b', {prop2: 'yo', prop3: false})

export default g
