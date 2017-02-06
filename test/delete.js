import should from 'should'
import g from './graph'

const g2 = g
  .addNodeLegacyIndex(123, 'node.1')
  .addEdgeLegacyIndex('abc', 'a.b')

describe('Deleters', () => {

  // Nodes
  describe('find and delete node in legacy index', () => {

    it('should find node', () => {
      should(g2.findNodeLegacyIndex(123)).equal('node.1')
    })

    it('should delete the node from legacy index', () => {
      const g3 = g2.deleteNodeLegacyIndex(123)
      should(g3.getNode('node.1')).not.be.ok()
    })

  })

  // edges
  describe('find and delete edge in legacy index', () => {

    it('should find edge', () => {
      should(g2.findEdgeLegacyIndex('abc')).equal('a.b')
    })

    it('should delete the edge from legacy index', () => {
      const g3 = g2.deleteEdgeLegacyIndex('abc')
      should(g3.getEdge('a.b')).not.be.ok()
    })

  })


})
