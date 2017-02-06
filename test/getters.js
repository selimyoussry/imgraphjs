import should from 'should'
import g from './graph'

describe('Getters', () => {

  // Testing how to get a node given a key
  describe('getNode', () => {

    it('should find node.1', () => {
      should(g.getNode('node.1')).be.ok()
    })

    it('should find node.2', () => {
      should(g.getNode('node.2')).be.ok()
    })

    it('should not find node.xxx', () => {
      should(g.getNode('node.xxx')).not.be.ok()
    })

  })

  // Testing how to get node properties given a key
  describe('getNodeProp', () => {

    it('should find node.1 prop2', () => {
      should(g.getNodeProp('node.1', 'prop2')).equal('hello')
    })

    it('should find node.2 prop2 after change', () => {
      should(g.getNodeProp('node.2', 'prop2')).equal('hullo')
    })

    it('should find node.2 prop2 after change of other prop', () => {
      should(g.getNodeProp('node.2', 'prop1')).equal(130)
    })

    it('should not find node.1 propxxx', () => {
      should(g.getNodeProp('node.1', 'propxxx')).not.be.ok()
    })

  })

  // Testing how to get an edge
  describe('getEdge', () => {

    it('should find edge a.b', () => {
      should(g.getEdge('a.b')).be.ok()
    })

    it('should not find edge b.c', () => {
      should(g.getEdge('b.c')).not.be.ok()
    })

  })

  // Testing how to get node properties given a key
  describe('getEdgeProp', () => {

    it('should find a.b prop3', () => {
      should(g.getEdgeProp('a.b', 'prop3')).equal(false)
    })

    it('should not find a.b propxxx', () => {
      should(g.getEdgeProp('a.b', 'propxxx')).not.be.ok()
    })

    it('should not find a.b prop2 after insert', () => {
      should(g.getEdgeProp('a.b', 'prop2')).equal('yo')
    })

  })

})
