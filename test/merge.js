import should from 'should'
import fs from 'fs'
import { Graph } from '../src'

const newGraph = JSON.parse(
  fs.readFileSync('./test/data1.json')
)

const g = Graph().merge(newGraph)

const delGraph = JSON.parse(
  fs.readFileSync('./test/data2.json')
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

    it('should not have a node person.patrick anymore', () => {
      should(g2.hasNode("person.patrick")).equal(false)
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

})
