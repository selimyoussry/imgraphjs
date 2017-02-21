import should from 'should'
import fs from 'fs'
import { Graph } from '../src'

const newGraph = JSON.parse(
  fs.readFileSync('./data/data1.json')
)

const g = Graph().merge(newGraph)

const delGraph = JSON.parse(
  fs.readFileSync('./data/data2.json')
)

describe('Merge', () => {

  // Nodes
  describe('should have nodes', () => {

    it('should find node from legacy index', () => {
      should(g.findNodeLegacyIndex("5")).equal('person.jimbo')
    })

    it('should find node prop', () => {
      should(g.getNodeProp('person.elliott', 'age')).equal(80)
    })

  })

  // Edges
  describe('should have edges', () => {

    it('should find edge from legacy index', () => {
      should(g.findEdgeLegacyIndex("9")).equal('elliott.is_father_of.john')
    })

  })

  // Delete
  describe('delete nodes and edges', () => {

    const g2 = g.merge(delGraph)
    const g3 = g2.merge(delGraph)

    it('should not have a node person.patrick anymore', () => {
      should(g3.hasNode("person.patrick")).equal(false)
    })

    it('should not have an edge patrick.worksin.OnePlus anymore', () => {
      should(g2.hasEdge("patrick.worksin.OnePlus")).equal(false)
    })

    it('should not have a node person.tim anymore', () => {
      should(g2.hasNode("person.tim")).equal(false)
    })

    it('should not have an edge tim.is_father_of.jimbo anymore', () => {
      should(g2.hasEdge("tim.is_father_of.jimbo")).equal(false)
    })

    it('should still have a node company.OnePlus', () => {
      should(g2.hasNode("company.OnePlus")).equal(true)
    })

    it('should still have a node person.luisa', () => {
      should(g2.hasNode("person.luisa")).equal(true)
    })

    it('should still have an edge clara.worksin.OnePlus', () => {
      should(g2.hasEdge("clara.worksin.OnePlus")).equal(true)
    })

    it('should still have an edge luisa.worksin.OnePlus', () => {
      should(g2.hasEdge("luisa.worksin.OnePlus")).equal(true)
    })

  })

  // Successive merges
  describe('allow successive merges', () => {

    const newNodes = ['n1', 'n2', 'n3', 'n4'].map((nodeKey) => {
      return {
        key: nodeKey,
        props: {
          name: nodeKey + nodeKey
        }
      }
    })

    const newEdges = [1, 2].map((edgeKeyNumber) => {
      return {
        key: `e${edgeKeyNumber}`,
        props: {
          name: `e${edgeKeyNumber + 1}`
        },
        label: 'TEST_ME',
        start: `n${edgeKeyNumber}`,
        end: `n${edgeKeyNumber + 1}`
      }
    })

    const g2 = g
      .mergeNodes(newNodes)
      .mergeEdges(newEdges)

    it('should find n3 name', () => {
      should(g2.getNodeProp('n3', 'name')).equal('n3n3')
    })

    it('should find e2 name', () => {
      should(g2.getEdgeProp('e2', 'name')).equal('e3')
    })

  })

})
