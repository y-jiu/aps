import {
  addEdge,
  ReactFlow,
  applyEdgeChanges,
  Background,
  ConnectionMode,
  MiniMap,
  MarkerType,
  ReactFlowProvider,
  applyNodeChanges,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useCallback, useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import {
  createProcessManagement,
  updateProcessManagement,
  deleteProcessManagement,
} from "../../../modules/information";
import { useDispatch, useSelector } from "react-redux";
import { ThunkDispatch } from "redux-thunk";
import { AnyAction } from "redux";
import Node from "./Node";

const ProcessManagementModal = ({
  onClose,
  product,
}: {
  onClose: () => void;
  product: any;
}) => {
  const dispatch = useDispatch<ThunkDispatch<any, any, AnyAction>>();
  const processManagement = useSelector(
    (state: any) => state.information.processManagement
  );

  const [nodes, setNodes] = useState<any[]>([]);
  const [edges, setEdges] = useState<any[]>([]);

  const nodeTypes = useMemo(() => ({ process: Node }), []);

  const calculateNodePositions = useCallback(() => {
    if (!processManagement?.nodes?.length) return [];

    const levels: Record<number, number> = {};
    const processed = new Set<number>();

    const calculateLevel = (nodeId: number, level: number) => {
      if (processed.has(nodeId)) return;
      levels[nodeId] = Math.max(level, levels[nodeId] || 0);
      processed.add(nodeId);

      processManagement.edges
        .filter((edge: any) => edge.from_node_id === nodeId)
        .forEach((edge: any) => calculateLevel(edge.to_node_id, level + 1));
    };

    const rootNodes = processManagement.nodes
      .filter(
        (node: any) =>
          !processManagement.edges.some(
            (edge: any) => edge.to_node_id === node.node_id
          )
      )
      .map((node: any) => node.node_id);

    rootNodes.forEach((id: number) => calculateLevel(id, 0));

    const nodesPerLevel: Record<number, number[]> = {};
    Object.entries(levels).forEach(([id, lvl]) => {
      nodesPerLevel[lvl] = nodesPerLevel[lvl] || [];
      nodesPerLevel[lvl].push(Number(id));
    });

    return processManagement.nodes.map((node: any) => ({
      id: node.node_id.toString(),
      data: {
        label: `[${node.node_id}]`,
        value: node.process_name,
        onDelete: handleDeleteNode,
        onChange: handleNodeValueChange,
      },
      type: "process",
      position: {
        x: levels[node.node_id] * 200,
        y: nodesPerLevel[levels[node.node_id]].indexOf(node.node_id) * 100,
      },
    }));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [processManagement]);

  const handleDeleteNode = useCallback(
    (nodeId: string) => {
      setNodes((nds) => nds.filter((node) => node.id !== nodeId));
      setEdges((eds) => eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId));
    },
    []
  );

  const handleNodeValueChange = useCallback((nodeId: string, value: string) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === nodeId ? { ...node, data: { ...node.data, value } } : node
      )
    );
  }, []);

  useEffect(() => {
    if (!processManagement?.nodes?.length) return;

    const updatedNodes = calculateNodePositions();
    
    setNodes(updatedNodes);

    const nodePosMap = new Map(updatedNodes.map((n: any) => [n.id, n.position]));

    const updatedEdges = processManagement.edges.map((edge: any) => {
      const sourcePos = nodePosMap.get(edge.from_node_id.toString()) as any;
      const targetPos = nodePosMap.get(edge.to_node_id.toString()) as any;
      const handles =
        sourcePos.x < targetPos.x
          ? { sourceHandle: "right-handle", targetHandle: "left-handle" }
          : { sourceHandle: "left-handle", targetHandle: "right-handle" };

      return {
        id: `${edge.from_node_id}-${edge.to_node_id}`,
        source: edge.from_node_id.toString(),
        target: edge.to_node_id.toString(),
        ...handles,
        type: 'smoothstep',
        markerEnd: { type: MarkerType.ArrowClosed },
      };
    });

    setEdges(updatedEdges);
  }, [processManagement, calculateNodePositions]);

  const onConnect = useCallback((params: any) => {
    setEdges((eds) => addEdge({ ...params, type: 'smoothstep', markerEnd: { type: MarkerType.ArrowClosed } }, eds));
  }, []);

  const onEdgesChange = useCallback(
    (changes: any) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  const handleNodesChange = useCallback(
    (changes: any) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );

  const handleSaveProcess = () => {
    const payload = {
      product_name: product.product_name,
      nodes: nodes.map((node) => ({
        node_id: node.id,
        process_name: node.data.value,
      })),
      edges: edges.map((edge) => ({
        from_node_id: edge.source,
        to_node_id: edge.target,
      })),
    };

    dispatch(
      processManagement?.nodes?.length
        ? updateProcessManagement(payload)
        : createProcessManagement(payload)
    );
  };

  const handleAddProcess = () => {
    setNodes((prevNodes) => {
      const nextNodeId = prevNodes.reduce((max, node) => Math.max(max, Number(node.id)), 0) + 1;
  
      const newNode = {
        id: nextNodeId.toString(),
        data: {
          label: `[${nextNodeId}]`,
          value: "",
          onDelete: handleDeleteNode,
          onChange: handleNodeValueChange,
        },
        type: "process",
        position: { x: 600, y: -100 },
      };
  
      return [...prevNodes, newNode];
    });
  };

  return (
    <ModalWrapper>
      <HeaderWrapper>
        <div>공정 관리 - {product.product_name}</div>
        <HeaderButtonWrapper>
          <SaveButton onClick={handleSaveProcess}>저장</SaveButton>
          {processManagement?.nodes?.length > 0 && (
            <DeleteAllButton onClick={() => dispatch(deleteProcessManagement(product.product_name))}>
              전체 삭제
            </DeleteAllButton>
          )}
          <CloseButton onClick={onClose}>×</CloseButton>
        </HeaderButtonWrapper>
      </HeaderWrapper>
      <ReactFlowProvider>
        <ReactFlow
          id="modal"
          nodes={nodes}
          edges={edges}
          onNodesChange={handleNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          snapToGrid={true}
          snapGrid={[15, 15]}
          connectionMode={ConnectionMode.Loose}
          style={{ backgroundColor: "#F7F9FB" }}
          fitView
        >
          <MiniMap zoomable pannable nodeClassName={(node: any) => node.type} />
          <Background />
        </ReactFlow>
        <div style={{ position: "fixed", bottom: '5%', left: '3%' }}>
          <AddButton onClick={handleAddProcess}>+</AddButton>
        </div>
      </ReactFlowProvider>
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
  display: flex;
  flex-direction: column;
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
  border-radius: 10px;
  cursor: pointer;
  font-size: 20px;
  font-weight: 800;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);

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

const SaveButton = styled.button`
  background: #4caf50;
  color: white;
  border: none;
  padding: 8px 15px;
  border-radius: 4px;
  margin-left: 10px;
`;
