import should from 'should'
import g from './graph'


describe('Hop', () => {

  // Find nodes from an edge
  describe('find other side', () => {

    it('should find node key', () => {
      should(g.hopKey('a.b', 'node.1')).equal('node.2')
    })

    it('should find node and thus property', () => {
      const node = g.hop('a.b', 'node.1')
      should(node.getIn(['props', 'prop2'])).equal('hullo')
    })

  })


  // Find nodes from an edge
  describe('find start / end', () => {

    it('should find end node property', () => {
      should(g.endN('a.b').getIn(['props', 'prop2'])).equal('hullo')
    })

    it('should find start node property', () => {
      should(g.startN('a.b').getIn(['props', 'key'])).equal('node.1')
    })

  })

})
