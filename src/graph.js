import { Map, fromJS } from 'immutable'

const makeProps = props => props
  ? fromJS(props)
  : Map()

const Node = (key, props) => Map({
  key,
  props: makeProps(props),
  out: Map(), // key (edgeKey) - value (reference to the edge)
  in: Map() // key (edgeKey) - value (reference to the edge)
})

const Edge = (key, label, start, end, props) => {
  return Map({
    key,
    label,
    start,
    end,
    props: makeProps(props)
  })

}
const newLegacyIndex = () => Map({
  nodes: Map(),
  edges: Map()
})

const newEmptyGraph = () => Map({
  nodes: Map(),
  edges: Map(),
  legacyIndex: newLegacyIndex()
})

const Graph = (g) => {

  const _graph = g || newEmptyGraph()

  // hasNode
  const hasNode = (key) => _graph.hasIn(['nodes', key])

  // getNode
  const getNode = (key) => _graph.getIn(['nodes', key])

  // getNodeProp
  const getNodeProp = (key, prop) => _graph.getIn(['nodes', key, 'props', prop])

  // getNodeProps returns the properties
  const getNodeProps = (key) => _graph.getIn(['nodes', key, 'props'])

  const _mergeNode = (g, key, props) => g.hasIn(['nodes', key])
      ? g.mergeIn(['nodes', key, 'props'], props)
      : g.setIn(['nodes', key], Node(key, props))

  // mergeNode
  function mergeNode(key, props){
    return Graph(_mergeNode(_graph, key, props))
  }

  // mergeNodes accepts a function as argument
  // this function should return a list of key, props to call mergeNode
  function mergeNodes(args) {
    const _underlyingGraph = args.reduce(
      (acc, {key, props}) => _mergeNode(acc, key, props),
      _graph
    )
    return Graph(_underlyingGraph)
  }

  // hasEdge
  const hasEdge = (key) => _graph.hasIn(['edges', key])

  // getEdge
  const getEdge = (key) => _graph.getIn(['edges', key])

  // getEdgeProp
  const getEdgeProp = (key, prop) => _graph
    .getIn(['edges', key, 'props', prop])

  // getEdgeProps returns the edge props
  const getEdgeProps = (key) => _graph.getIn(['edges', key, 'props'])

  const _mergeEdge = (g, key, props, label, start, end) => {

    const edgeExists = g.hasIn(['edges', key])
    const g1 = edgeExists
      ? g.mergeIn(['edges', key, 'props'], props)
      : g.setIn(['edges', key], Edge(key, label, start, end, props))

    const g2 = edgeExists
      ? g1
      : g1
        .setIn(['nodes', start, 'out', key], label)
        .setIn(['nodes', end, 'in', key], label)

    return g2
  }

  // mergeEdge
  function mergeEdge(key, props, label, start, end){
    return Graph(_mergeEdge(_graph, key, props, label, start, end))
  }

  // mergeEdges
  function mergeEdges(args){
    const _underlyingGraph = args.reduce(
      (acc, {key, props, label, start, end}) =>
        _mergeEdge(acc, key, props, label, start, end),
      _graph
    )
    return Graph(_underlyingGraph)
  }

  const _deleteNode = (g, key) => g
    .deleteIn(['nodes', key])

  // deleteNode
  function deleteNode(key){
    return Graph(_deleteNode(_graph, key))
  }

  // deleteNodes deletes multiple edges in one call
  function deleteNodes(keys){
    const _underlyingGraph = keys.reduce(
      (acc, key) => _deleteNode(acc, key),
      _graph
    )
    return Graph(_underlyingGraph)
  }

  const _deleteEdge = (g, edgeKey) => {
    const edge = g.getIn(['edges', edgeKey])
    if(!edge){
      return g
    }
    const startNodeKey = edge.get('start')
    const endNodeKey = edge.get('end')

    const startNodeOut = g
      .getIn(['nodes', startNodeKey, 'out'])
      .filter((_edgeLabel, _edgeKey) => _edgeKey !== edgeKey)

    const endNodeIn = g
      .getIn(['nodes', endNodeKey, 'in'])
      .filter((_edgeLabel, _edgeKey) => _edgeKey !== edgeKey)

    return g
      .deleteIn(['edges', edgeKey])
      .setIn(['nodes', startNodeKey, 'out'], startNodeOut)
      .setIn(['nodes', endNodeKey, 'in'], endNodeIn)

  }
  // deleteEdge
  function deleteEdge(key){
    return Graph(_deleteEdge(_graph, key))
  }

  // deleteEdges deletes multiple edges in one call
  function deleteEdges(keys){
    const _underlyingGraph = keys.reduce(
      (acc, key) => _deleteEdge(acc, key),
      _graph
    )
    return Graph(_underlyingGraph)
  }

  const _addNodeLegacyIndex = (g, legacyIndex, index) => {
    const li = `legacy.${legacyIndex}`
    return g
      .setIn(['legacyIndex', 'nodes', li], index)
      .setIn(['legacyIndex', 'nodes', index], li)
  }

  // addNodeLegacyIndex
  function addNodeLegacyIndex(legacyIndex, index){
    return Graph(_addNodeLegacyIndex(_graph, legacyIndex, index))
  }

  const _addEdgeLegacyIndex = (g, legacyIndex, index) => {
    const li = `legacy.${legacyIndex}`
    return g
      .setIn(['legacyIndex', 'edges', li], index)
      .setIn(['legacyIndex', 'edges', index], li)
  }

  // addEdgeLegacyIndex
  function addEdgeLegacyIndex(legacyIndex, index){
    return Graph(_addEdgeLegacyIndex(_graph, legacyIndex, index))
  }

  const _findNodeLegacyIndex = (g, legacyIndex) => {
    const li = `legacy.${legacyIndex}`
    return g.getIn(['legacyIndex', 'nodes', li])
  }

  // findNodeLegacyIndex
  function findNodeLegacyIndex(legacyIndex){
    return _findNodeLegacyIndex(_graph, legacyIndex)
  }

  const _findEdgeLegacyIndex = (g, legacyIndex) => {
    const li = `legacy.${legacyIndex}`
    return g.getIn(['legacyIndex', 'edges', li])
  }

  // findEdgeLegacyIndex
  function findEdgeLegacyIndex(legacyIndex){
    return _findEdgeLegacyIndex(_graph, legacyIndex)
  }

  const _deleteNodeLegacyIndex = (g, legacyIndex) => {
    const nodeKey = _findNodeLegacyIndex(g, legacyIndex)
    const li = `legacy.${legacyIndex}`

    const g1 = g
      .deleteIn(['legacyIndex', 'nodes', li])
      .deleteIn(['legacyIndex', 'nodes', nodeKey])

    return _deleteNode(g1, nodeKey)
  }

  // deleteNodeLegacyIndex
  function deleteNodeLegacyIndex(legacyIndex){
    return Graph(
      _deleteNodeLegacyIndex(_graph, legacyIndex)
    )
  }

  const _deleteEdgeLegacyIndex = (g, legacyIndex) => {
    const edgeKey = _findEdgeLegacyIndex(g, legacyIndex)
    const li = `legacy.${legacyIndex}`

    const g1 = g
      .deleteIn(['legacyIndex', 'edges', li])
      .deleteIn(['legacyIndex', 'edges', edgeKey])

    return _deleteEdge(g1, edgeKey)
  }

  // deleteEdgeLegacyIndex
  function deleteEdgeLegacyIndex(legacyIndex){
    return Graph(
      _deleteEdgeLegacyIndex(_graph, legacyIndex)
    )
  }

  // inEKeys
  // in graphgo, that's a node level method, but here it is at the graph level
  const inEKeys = (nodeKey, label) => {
    return _graph.getIn(['nodes', nodeKey, 'in'])
      .filter(
        (edgeLabel, edgeKey) => (edgeLabel === label) && hasEdge(edgeKey)
      )
  }

  // inE
  const inE = (nodeKey, label) => {
    return inEKeys(nodeKey, label)
      .map((edgeLabel, edgeKey) => getEdge(edgeKey))
  }

  // outEKeys
  // in graphgo, that's a node level method, but here it is at the graph level
  const outEKeys = (nodeKey, label) => {
    return _graph.getIn(['nodes', nodeKey, 'out'])
      .filter(
        (edgeLabel, edgeKey) => (edgeLabel === label) && hasEdge(edgeKey)
      )
  }

  // outE
  const outE = (nodeKey, label) => {
    return outEKeys(nodeKey, label)
      .map((edgeLabel, edgeKey) => getEdge(edgeKey))
  }

  // hopKey
  // given an edge and a node, return the other side (key only)
  const hopKey = (edgeKey, nodeKey) => {
    if(!hasEdge(edgeKey)){
      return undefined
    }

    const edge = getEdge(edgeKey)
    switch(nodeKey){
      case edge.get('start'):
        return edge.get('end')
      case edge.get('end'):
        return edge.get('start')
      default:
        return undefined
    }
  }

  // hop
  // given an edge and a node, return the other side
  const hop = (edgeKey, nodeKey) => {
    const otherNodeKey = hopKey(edgeKey, nodeKey)
    if(otherNodeKey === undefined){
      return undefined
    }

    return getNode(otherNodeKey)
  }

  // startN
  const startN = (edgeKey) => {
    if(!hasEdge(edgeKey)){
      return undefined
    }
    const edge = getEdge(edgeKey)

    return getNode(edge.get('start'))
  }

  // endN
  const endN = (edgeKey) => {
    if(!hasEdge(edgeKey)){
      return undefined
    }
    const edge = getEdge(edgeKey)

    return getNode(edge.get('end'))
  }

  // merge
  function merge({
    '$merge': {
      nodes, edges,
      legacyIndex: {
        nodes: legacyNodes, edges: legacyEdges
      }
    },
    '$delete': {
      nodes: delNodes, edges: delEdges,
      legacyNodes: delLegacyNodes, legacyEdges: delLegacyEdges
    }
  }){

    // Delete edges
    const dg1 = delEdges.reduce(
      (acc, edgeKey) => _deleteEdge(acc, edgeKey),
      _graph
    )

    // Delete legacy edges
    const dg2 = delLegacyEdges.reduce(
      (acc, legacyEdgeKey) => _deleteEdgeLegacyIndex(acc, legacyEdgeKey),
      dg1
    )

    // Delete nodes
    const dg3 = delNodes.reduce(
      (acc, nodeKey) => _deleteNode(acc, nodeKey),
      dg2
    )

    // Delete legacy nodes
    const dg4 = delLegacyNodes.reduce(
      (acc, legacyNodeKey) => _deleteNodeLegacyIndex(acc, legacyNodeKey),
      dg3
    )

    // Add the nodes
    const g1 = Object.keys(nodes).reduce(
      (acc, nodeKey) => {
        const node = nodes[nodeKey]
        return _mergeNode(acc, nodeKey, node['props'])
      },
      dg4
    )

    // Add the edges
    const g2 = Object.keys(edges).reduce(
      (acc, edgeKey) => {
        const edge = edges[edgeKey]

        return _mergeEdge(
          acc, edgeKey,
          edge['props'], edge['label'],
          edge['start'], edge['end']
        )
      },
      g1
    )

    // Add the legacy nodes
    const g3 = Object.keys(legacyNodes).reduce(
      (acc, legacyNodeIndex) => {
        const nodeKey = legacyNodes[legacyNodeIndex]
        return _addNodeLegacyIndex(acc, legacyNodeIndex, nodeKey)
      },
      g2
    )

    // Add the legacy edges
    const g4 = Object.keys(legacyEdges).reduce(
      (acc, legacyEdgeIndex) => {
        const edgeKey = legacyEdges[legacyEdgeIndex]
        return _addEdgeLegacyIndex(acc, legacyEdgeIndex, edgeKey)
      },
      g3
    )

    return Graph(g4)
  }

  function toJS(){
    return _graph.toJS()
  }

  // return
  function graph (){
    return _graph
  }

  return {
    hasNode, getNode, getNodeProp, mergeNode, mergeNodes,
    hasEdge, getEdge, getEdgeProp, mergeEdge, mergeEdges,
    merge,
    deleteNode, deleteEdge,
    addNodeLegacyIndex, addEdgeLegacyIndex,
    findNodeLegacyIndex, findEdgeLegacyIndex,
    deleteEdgeLegacyIndex, deleteNodeLegacyIndex,
    inEKeys, outEKeys, inE, outE, hopKey, hop, startN, endN,
    graph,
    toJS
  }

}

export default Graph
