import { ReactFlow, MiniMap, MarkerType, useReactFlow, Viewport, ReactFlowInstance } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import CustomNode from './CustomNode';

const ProcessManagement = () => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedNode, setSelectedNode] = useState<any>(null);
  const [nodes, setNodes] = useState<any>([]);
  const [edges, setEdges] = useState<any>([]);
  const [draggedNode, setDraggedNode] = useState<any>(null);
  const [lockedViewState, setLockedViewState] = useState<Viewport | null>(null);
  const reactFlowInstance = useReactFlow()

  const nodeClassName = (node: any) => node.type

  const processManagement = useSelector((state: any) => state.information.processManagement);

  const handleNodeDragStart = (event: any, node: any) => {
    const originalNode = processManagement.nodes.find(
      (n: any) => n.node_id.toString() === node.id
    );
    setDraggedNode(originalNode);
  
    const ghost = document.createElement('div');
    ghost.id = 'drag-ghost';
    ghost.innerHTML = originalNode?.process_name || '';
    ghost.setAttribute('data-process-id', node.id);
    ghost.setAttribute('data-process-name', originalNode?.process_name || '');
    ghost.style.cssText = `
      position: fixed;
      background: white;
      padding: 8px;
      text-size: 10px;
      border: 1px solid #ccc;
      border-radius: 4px;
      pointer-events: none;
      z-index: 1000;
      opacity: 0.8;
      transform: translate(-50%, -50%);
    `;
  
    ghost.style.left = `${event.clientX + 10}px`;
    ghost.style.top = `${event.clientY + 10}px`;
  
    document.body.appendChild(ghost);
  };

  const handleNodeDrag = (event: any, node: any) => {
    const ghost = document.getElementById('drag-ghost');
    if (ghost) {
      ghost.style.left = `${event.clientX + 10}px`;
      ghost.style.top = `${event.clientY + 10}px`;
    }
  };

  const handleNodeDragEnd = (event: any, node: any) => {
    const ghost = document.getElementById('drag-ghost');
    const originalNode = processManagement.nodes.find(
      (n: any) => n.node_id.toString() === node.id
    );
  
    if (ghost) {
      const dropEvent = new CustomEvent('processDrop', {
        detail: {
          processId: originalNode?.id,
          processnodeId: originalNode?.node_id,
          processName: originalNode?.process_name,
          x: event.clientX,
          y: event.clientY,
        },
      });
      document.dispatchEvent(dropEvent);
      ghost.remove();
    }
    
    setDraggedNode(null);
  };
  

  const calculateNodePositions = () => {
    const HORIZONTAL_SPACING = 200;
    const VERTICAL_SPACING = 100;
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
      processManagement.edges
        .filter((edge: any) => edge.from_node_id === nodeId)
        .forEach((edge: any) => calculateLevel(edge.to_node_id, level + 1));
    };

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
      },
      type: "customNode"
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
      target: edge.to_node_id.toString(),
      type: 'smoothstep',
      markerEnd: {
        type: MarkerType.ArrowClosed,
      }
      }));
      setEdges(edges);

  }, [processManagement]);

  const handleNodeClick = (event: any, node: any) => {
    const originalNode = processManagement.nodes.find((n: any) => n.node_id.toString() === node.id);
    
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

  const onInit = useCallback((instance: ReactFlowInstance) => {
    instance.fitView();
    setTimeout(() => {
      const currentViewport = instance.getViewport();
      setLockedViewState(currentViewport);
    }, 0);
  }, []);

  const onMove = useCallback((event: any, newViewState: Viewport) => {
    if (lockedViewState && reactFlowInstance.getViewport()) {
      if (
        newViewState.x !== lockedViewState.x ||
        newViewState.y !== lockedViewState.y ||
        newViewState.zoom !== lockedViewState.zoom
      ) {
        reactFlowInstance.setViewport(lockedViewState);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lockedViewState]);


  return (  
    <Container>
      <ReactFlow 
        nodes={nodes}
        nodeTypes={{
            customNode: CustomNode,
        }}
        edges={edges}
        onInit={onInit}
        onMove={onMove}
        onNodeClick={handleNodeClick}
        onNodeDragStart={handleNodeDragStart}
        onNodeDrag={handleNodeDrag}
        onNodeDragStop={handleNodeDragEnd}
        draggable={false}
        panOnDrag={false}
        panOnScroll={false}
        zoomOnScroll={false}
        zoomOnPinch={false} 
        zoomOnDoubleClick={false}
        fitView
        style={{
          overscrollBehavior: 'none'
        }}
      >
        <MiniMap zoomable pannable nodeClassName={nodeClassName} />
      </ReactFlow>
    </Container>
  );
};

export default ProcessManagement;

const Container = styled.div`
  width: 100%;
  height: 300px;
`;