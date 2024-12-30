import { ReactFlow } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { createProcessManagement, updateProcessManagement, deleteProcessManagement } from '../../../modules/information';
import { useDispatch, useSelector } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';

const ProcessManagement = () => {
  const dispatch = useDispatch<ThunkDispatch<any, any, AnyAction>>();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedNode, setSelectedNode] = useState<any>(null);
  const [nodes, setNodes] = useState<any>([]);
  const [edges, setEdges] = useState<any>([]);

  const processManagement = useSelector((state: any) => state.information.processManagement);
  
  console.log(processManagement);
  
  const calculateNodePositions = () => {
    const HORIZONTAL_SPACING = 200;
    const VERTICAL_SPACING = 100;
    
    // Calculate levels for each node
    const levels: { [key: number]: number } = {};
    const processed = new Set<number>();
    if (!processManagement) {
      return [];
    }

    if (processManagement.nodes && processManagement.nodes.length === 0) {
      return [];
    }
    const calculateLevel = (nodeId: number, level: number) => {
      if (processed.has(nodeId)) return;
      levels[nodeId] = Math.max(level, levels[nodeId] || 0);
      processed.add(nodeId);
      
      // Find all outgoing edges from this node
      processManagement.edges
        .filter((edge: any) => edge.from_node_id === nodeId)
        .forEach((edge: any) => calculateLevel(edge.to_node_id, level + 1));
    };

    console.log(processManagement);
    // Find root nodes (nodes with no incoming edges)
    const rootNodes = processManagement.nodes
      .filter((node: any) => !processManagement.edges.some((edge: any) => edge.to_node_id === node.node_id))
      .map((node: any) => node.node_id);

    // Calculate levels starting from root nodes
    rootNodes.forEach((nodeId: number) => calculateLevel(nodeId, 0));

    // Group nodes by level
    const nodesPerLevel: { [key: number]: number[] } = {};
    Object.entries(levels).forEach(([nodeId, level]) => {
      nodesPerLevel[level] = nodesPerLevel[level] || [];
      nodesPerLevel[level].push(Number(nodeId));
    });

    // Calculate positions
    return processManagement.nodes.map((node: any) => ({
      id: node.node_id.toString(),
      data: { label: `[${node.node_id}] ${node.process_name}` },
      position: {
        x: levels[node.node_id] * HORIZONTAL_SPACING,
        y: nodesPerLevel[levels[node.node_id]].indexOf(node.node_id) * VERTICAL_SPACING
      }
    }));
  };
  
  useEffect(() => {
    if (Object.keys(processManagement).length === 0) {
      return;
    }
    const nodes = calculateNodePositions();
    setNodes(nodes);
    const edges = processManagement.edges.map((edge: any) => ({
      id: `${edge.from_node_id}-${edge.to_node_id}`,
      source: edge.from_node_id.toString(),
      target: edge.to_node_id.toString()
      }));
      setEdges(edges);

  }, [processManagement]);

  const handleNodeClick = (event: any, node: any) => {
    // Find the original node data to get the process name
    const originalNode = processManagement.nodes.find((n: any) => n.node_id.toString() === node.id);
    
    // Find previous and next nodes from edges
    const prevNodes = processManagement.edges
      .filter((edge: any) => edge.to_node_id.toString() === node.id)
      .map((edge: any) => edge.from_node_id);
    
    const nextNodes = processManagement.edges
      .filter((edge: any) => edge.from_node_id.toString() === node.id)
      .map((edge: any) => edge.to_node_id);

    const formattedNode = {
      node_id: parseInt(node.id),
      process_name: originalNode?.process_name || '',
      prev_node_id: prevNodes[0], // Taking first prev node if exists
      next_node_id: nextNodes[0], // Taking first next node if exists
    };

    setSelectedNode(formattedNode);
    setIsEditModalOpen(true);
  };

  return (
    <Container>
      <ReactFlow 
        nodes={nodes}
        edges={edges}
        onNodeClick={handleNodeClick}
        fitView
      />
    </Container>
  );
};

export default ProcessManagement;

const Container = styled.div`
  width: 100%;
  height: 300px;
`;

const HeaderWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  border-bottom: 1px solid #e0e0e0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  padding: 0;
  color: #666;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 10px;
  
  &:hover {
    color: #000;
  }
`;

const AddButton = styled.button`
  background: #007bff;
  color: white;
  border: none;
  padding: 8px 15px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 13px;

  &:hover {
    background: #0056b3;
  }
`;

const HeaderButtonWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const DeleteAllButton = styled.button`
  background: #dc3545;
  color: white;
  border: none;
  padding: 8px 15px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 13px;
  margin-left: 10px;

  &:hover {
    background: #c82333;
  }
`;