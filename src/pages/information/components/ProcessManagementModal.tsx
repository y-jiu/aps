import { ReactFlow } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import AddProcessModal from './AddProcessModal';

const ProcessManagementModal = (
  { isOpen, onClose, product }: { isOpen: boolean, onClose: () => void, product: any }
) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedNode, setSelectedNode] = useState<any>(null);
  
  const mockData = {
    "product_name": "213fse",
    "nodes": [
      {
        "node_id": 1,
        "process_name": "CNC 1차"
      },
      {
        "node_id": 2,
        "process_name": "CNC 1차"
      },
      {
        "node_id": 3,
        "process_name": "CNC 1차"
      },
      {
        "node_id": 4,
        "process_name": "CNC 2차"
      },
      {
        "node_id": 5,
        "process_name": "CNC 3차"
      },
      {
        "node_id": 6,
        "process_name": "CNC 4차"
      },
      {
        "node_id": 7,
        "process_name": "CNC 4차"
      },
      {
        "node_id": 8,
        "process_name": "CNC 5차"
      },
      {
        "node_id": 9,
        "process_name": "CNC 6차"
      },
      {
        "node_id": 10,
        "process_name": "MCT 1+2+3차"
      }
    ],
    "edges": [
      {
        "from_node_id": 1,
        "to_node_id": 4
      },
      {
        "from_node_id": 2,
        "to_node_id": 4
      },
      {
        "from_node_id": 3,
        "to_node_id": 5
      },
      {
        "from_node_id": 4,
        "to_node_id": 6
      },
      {
        "from_node_id": 5,
        "to_node_id": 7
      },
      {
        "from_node_id": 5,
        "to_node_id": 8
      },
      {
        "from_node_id": 7,
        "to_node_id": 6
      },
      {
        "from_node_id": 6,
        "to_node_id": 9
      },
      {
        "from_node_id": 8,
        "to_node_id": 9
      },
      {
        "from_node_id": 9,
        "to_node_id": 10
      }
    ]
  }

  // Calculate node levels and positions
  const calculateNodePositions = () => {
    const HORIZONTAL_SPACING = 200;
    const VERTICAL_SPACING = 100;
    
    // Calculate levels for each node
    const levels: { [key: number]: number } = {};
    const processed = new Set<number>();
    
    const calculateLevel = (nodeId: number, level: number) => {
      if (processed.has(nodeId)) return;
      levels[nodeId] = Math.max(level, levels[nodeId] || 0);
      processed.add(nodeId);
      
      // Find all outgoing edges from this node
      mockData.edges
        .filter(edge => edge.from_node_id === nodeId)
        .forEach(edge => calculateLevel(edge.to_node_id, level + 1));
    };

    // Find root nodes (nodes with no incoming edges)
    const rootNodes = mockData.nodes
      .filter(node => !mockData.edges.some(edge => edge.to_node_id === node.node_id))
      .map(node => node.node_id);

    // Calculate levels starting from root nodes
    rootNodes.forEach(nodeId => calculateLevel(nodeId, 0));

    // Group nodes by level
    const nodesPerLevel: { [key: number]: number[] } = {};
    Object.entries(levels).forEach(([nodeId, level]) => {
      nodesPerLevel[level] = nodesPerLevel[level] || [];
      nodesPerLevel[level].push(Number(nodeId));
    });

    // Calculate positions
    return mockData.nodes.map(node => ({
      id: node.node_id.toString(),
      data: { label: `[${node.node_id}] ${node.process_name}` },
      position: {
        x: levels[node.node_id] * HORIZONTAL_SPACING,
        y: nodesPerLevel[levels[node.node_id]].indexOf(node.node_id) * VERTICAL_SPACING
      }
    }));
  };

  const nodes = calculateNodePositions();
  const edges = mockData.edges.map((edge: any) => ({
    id: `${edge.from_node_id}-${edge.to_node_id}`,
    source: edge.from_node_id.toString(),
    target: edge.to_node_id.toString()
  }));

  useEffect(() => {
    // console.log(product);
  }, [product]);

  const handleAddProcess = (data: {
    nodes: Array<{ node_id: number; process_name: string }>;
    edges: Array<{ from_node_id: number; to_node_id: number }>;
  }) => {
    console.log(data);
  };

  const handleNodeClick = (event: any, node: any) => {
    // Find the original node data to get the process name
    const originalNode = mockData.nodes.find(n => n.node_id.toString() === node.id);
    
    // Find previous and next nodes from edges
    const prevNodes = mockData.edges
      .filter(edge => edge.to_node_id.toString() === node.id)
      .map(edge => edge.from_node_id);
    
    const nextNodes = mockData.edges
      .filter(edge => edge.from_node_id.toString() === node.id)
      .map(edge => edge.to_node_id);

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
    <ModalWrapper>
      <HeaderWrapper>
        <div>공정 관리 - {product.product_name}</div>
        <HeaderButtonWrapper>
          <AddButton onClick={() => setIsAddModalOpen(true)}>공정 추가</AddButton>
          <CloseButton onClick={() => onClose()}>×</CloseButton>
        </HeaderButtonWrapper>
      </HeaderWrapper>
      
      <ReactFlow 
        nodes={nodes}
        edges={edges}
        onNodeClick={handleNodeClick}
        fitView
      />

      <AddProcessModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        nodes={mockData.nodes}
        onSubmit={handleAddProcess}
      />

      <AddProcessModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        nodes={mockData.nodes}
        onSubmit={handleAddProcess}
        editMode={true}
        initialData={selectedNode}
      />
    </ModalWrapper>
  );
};

export default ProcessManagementModal;

const ModalWrapper = styled.div`
  position: fixed;
  top: 50%;
  left: 55%;
  transform: translate(-50%, -50%);
  width: 70%;
  height: 70%;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.5);
  z-index: 1000;
  overflow: hidden;
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