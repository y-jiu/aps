import {
  addEdge,
  ReactFlow,
  applyEdgeChanges,
  Background,
  ConnectionMode,
  MiniMap,
  MarkerType,
  ReactFlowProvider,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useCallback, useEffect, useState } from "react";
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
  const [nodes, setNodes] = useState<any>([]);
  const [edges, setEdges] = useState<any>([]);
  const [maxNodeId, setMaxNodeId] = useState<number>(0);

  const processManagement = useSelector(
    (state: any) => state.information.processManagement
  );

  const nodeClassName = (node: any) => node.type;

  const nodeTypes = {
    process: Node,
  };
  const calculateNodePositions = () => {
    const HORIZONTAL_SPACING = 200;
    const VERTICAL_SPACING = 100;

    // Calculate levels for each node
    const levels: { [key: number]: number } = {};
    const processed = new Set<number>();
    if (!processManagement) {
      return [];
    }

    if (processManagement?.nodes && processManagement?.nodes.length === 0) {
      return [];
    }
    const calculateLevel = (nodeId: number, level: number) => {
      if (processed.has(nodeId)) return;
      levels[nodeId] = Math.max(level, levels[nodeId] || 0);
      processed.add(nodeId);

      // Find all outgoing edges from this node
      processManagement?.edges
        .filter((edge: any) => edge.from_node_id === nodeId)
        .forEach((edge: any) => calculateLevel(edge.to_node_id, level + 1));
    };

    // Find root nodes (nodes with no incoming edges)
    const rootNodes = processManagement?.nodes
      .filter(
        (node: any) =>
          !processManagement?.edges.some(
            (edge: any) => edge.to_node_id === node.node_id
          )
      )
      .map((node: any) => node.node_id);

    // Calculate levels starting from root nodes
    rootNodes.forEach((nodeId: number) => calculateLevel(nodeId, 0));

    // Group nodes by level
    const nodesPerLevel: { [key: number]: number[] } = {};
    Object.entries(levels).forEach(([nodeId, level]) => {
      nodesPerLevel[level] = nodesPerLevel[level] || [];
      nodesPerLevel[level].push(Number(nodeId));
    });

    setMaxNodeId(Math.max(...Object.keys(levels).map(Number)));

    // Calculate positions
    return processManagement.nodes.map((node: any) => ({
      id: node.node_id.toString(),
      data: { label: `[${node.node_id}]`, value: node.process_name },
      type: "process",
      position: {
        x: levels[node.node_id] * HORIZONTAL_SPACING,
        y:
          nodesPerLevel[levels[node.node_id]].indexOf(node.node_id) *
          VERTICAL_SPACING,
      },
    }));
  };

  const determineHandles = (sourceNode: any, targetNode: any) => {
    // 노드의 X 좌표만 비교하여 연결 방향 결정
    const sourceX = sourceNode.position.x;
    const targetX = targetNode.position.x;

    // 왼쪽에서 오른쪽으로 연결
    if (sourceX < targetX) {
      return { sourceHandle: "right-handle", targetHandle: "left-handle" };
    }
    // 오른쪽에서 왼쪽으로 연결
    else {
      return { sourceHandle: "left-handle", targetHandle: "right-handle" };
    }
  };

  const handleDeleteNode = useCallback((nodeId: string) => {
    setNodes((nds: any) => nds.filter((node: any) => node.id !== nodeId));
    setEdges((eds: any) =>
      eds.filter(
        (edge: any) => edge.source !== nodeId && edge.target !== nodeId
      )
    );
  }, []);

  const handleNodeValueChange = useCallback((nodeId: string, value: string) => {
    setNodes((nds: any) =>
      nds.map((node: any) =>
        node.id === nodeId ? { ...node, data: { ...node.data, value } } : node
      )
    );
  }, []);

  useEffect(() => {
    if (!processManagement) return;
    if (!processManagement?.nodes) return;
    if (processManagement?.nodes && processManagement?.nodes.length === 0)
      return;
    if (processManagement?.edges && processManagement?.edges.length === 0)
      return;

    const nodes = calculateNodePositions().map((node: any) => ({
      ...node,
      data: {
        ...node.data,
        onDelete: handleDeleteNode,
        onChange: handleNodeValueChange,
      },
    }));
    setNodes(nodes);

    const edges = processManagement.edges.map((edge: any) => {
      const sourceNode = nodes.find(
        (n: any) => n.id === edge.from_node_id.toString()
      );
      const targetNode = nodes.find(
        (n: any) => n.id === edge.to_node_id.toString()
      );
      const handles = determineHandles(sourceNode, targetNode);

      return {
        id: `${edge.from_node_id}-${edge.to_node_id}`,
        source: edge.from_node_id.toString(),
        target: edge.to_node_id.toString(),
        sourceHandle: handles.sourceHandle,
        targetHandle: handles.targetHandle, 
        type: 'smoothstep',
        markerEnd: { type: MarkerType.ArrowClosed },
      };
    });

    setEdges(edges);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [processManagement, handleDeleteNode, handleNodeValueChange]);

  useEffect(() => {
    // console.log(product);
  }, [product]);

  const handleAddProcess = () => {
    // node id 계산

    const node = {
      id: (maxNodeId + 1).toString(),
      data: {
        label: `[${maxNodeId + 1}]`,
        value: "",
        onDelete: handleDeleteNode,
        onChange: handleNodeValueChange,
      },
      type: "process",
      position: { x: 600, y: -100 },
    };

    setMaxNodeId(maxNodeId + 1);
    setNodes([...nodes, node]);
  };

  const handleNodeClick = (event: any, node: any) => {};

  const handleDeleteAllProcesses = () => {
    if (window.confirm("모든 공정을 삭제하시겠습니까?")) {
      dispatch(deleteProcessManagement(product.product_name));
    }
  };

  const handleNodesChange = (changes: any) => {
    setNodes((nds: any) => {
      const updatedNodes = nds.map((node: any) => {
        const change = changes.find((c: any) => c.id === node.id);
        if (change) {
          if (change.position) {
            return { ...node, position: change.position };
          }
          return node;
        }
        return node;
      });
      return updatedNodes;
    });
  };

  const onEdgesChange = useCallback(
    (changes: any) => setEdges((eds: any) => applyEdgeChanges(changes, eds)),
    []
  );

  const handleSaveProcess = () => {
    const processManagementNodes = nodes.map((node: any) => ({
      node_id: node.id,
      process_name: node.data.value,
    }));

    const processManagementEdges = edges.map((edge: any) => ({
      from_node_id: edge.source,
      to_node_id: edge.target,
    }));

    const processManagementData = {
      product_name: product.product_name,
      nodes: processManagementNodes,
      edges: processManagementEdges,
    };
    if (
      processManagement?.nodes == null ||
      processManagement?.nodes?.length === 0
    ) {
      dispatch(createProcessManagement(processManagementData));
    } else {
      dispatch(updateProcessManagement(processManagementData));
    }
  };

  const onConnect = useCallback(
    (params: any) => {
      const newEdge = {
        ...params,
        id: `${params.source}-${params.target}`,
        sourceHandle: params.sourceHandle,
        targetHandle: params.targetHandle,
        type: 'smoothstep',
        markerEnd: { type: MarkerType.ArrowClosed },
      };

      setEdges((eds: any) => addEdge(newEdge, eds));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [nodes]
  );

  const onEdgeClick = useCallback((event: React.MouseEvent, edge: any) => {
    setEdges((eds: any) => eds.filter((e: any) => e.id !== edge.id));
  }, []);

  return (
    <ModalWrapper>
      <HeaderWrapper>
        <div>공정 관리 - {product.product_name}</div>
        <HeaderButtonWrapper>
          <SaveButton onClick={handleSaveProcess}>저장</SaveButton>
          {processManagement?.nodes && processManagement?.nodes.length > 0 && (
            <DeleteAllButton onClick={handleDeleteAllProcesses}>
              전체 삭제
            </DeleteAllButton>
          )}
          <CloseButton onClick={() => onClose()}>×</CloseButton>
        </HeaderButtonWrapper>
      </HeaderWrapper>
      <div style={{ flex: 1, position: 'relative' }}>
        <ReactFlowProvider>  
          <ReactFlow
            id='modal'
            nodes={nodes}
            edges={edges}
            onNodeClick={handleNodeClick}
            onEdgeClick={onEdgeClick}
            nodeTypes={nodeTypes}
            onNodesChange={handleNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            panOnDrag={true}
            connectOnClick={true}
            snapToGrid={true}
            snapGrid={[15, 15]}
            connectionMode={ConnectionMode.Loose}
            style={{ backgroundColor: "#F7F9FB" }}
            fitView
          >
            <MiniMap zoomable pannable nodeClassName={nodeClassName} />
            <Background />
          </ReactFlow>
          <div style={{ position: "fixed", bottom: '5%', left: '3%' }}>
            <AddButton onClick={handleAddProcess}>+</AddButton>
          </div>
        </ReactFlowProvider>
      </div>
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
