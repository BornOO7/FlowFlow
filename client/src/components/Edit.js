import React, { useState, useCallback, useContext, useEffect } from 'react';
import ReactFlow, {
  ReactFlowProvider,
  useNodesState,
  useEdgesState,
  addEdge,
  useReactFlow,
} from 'react-flow-renderer';
import { NavLink, useParams,useHistory } from 'react-router-dom'
import { updatedata } from './context/ContextProvider'

import './saverestore.css';

let flowKeyData = 'example-flow';

const flowKey = 'example-flow';
const graphStyles = { width: "100%", height: "500px" };

const getNodeId = () => `randomnode_${+new Date()}`;

const initialNodes = [
  { id: '1', data: { label: 'Node 1' }, position: { x: 100, y: 100 } },
  { id: '2', data: { label: 'Node 2' }, position: { x: 100, y: 200 } },
];

const initialEdges = [{ id: 'e1-2', source: '1', target: '2' }];

const SaveRestore = () => {
    const [getuserdata, setUserdata] = useState([]);
    console.log(getuserdata);

   const {updata, setUPdata} = useContext(updatedata)

    const history = useHistory("");

    const [inpval, setINP] = useState({
        name: "",
        email: "",
    })

    const setdata = (e) => {
        console.log(e.target.value);
        const { name, value } = e.target;
        setINP((preval) => {
            return {
                ...preval,
                [name]: value
            }
        })
    }


    const { id } = useParams("");
    console.log(id);



    const getdata = async () => {

        const res = await fetch(`http://localhost:8003/getuser/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });

        const data = await res.json();
        console.log(data);
        flowKeyData = data.flowKey

        if (res.status === 422 || !data) {
            console.log("error ");

        } else {
            setINP(data)
            console.log("get data");

        }
    }

    useEffect(() => {
        getdata();
    }, []);


    const updateuser = async(e)=>{
        e.preventDefault();

        if (rfInstance) {
            const flowKey = rfInstance.toObject();
            //localStorage.setItem(flowKey, JSON.stringify(flow));
            e.preventDefault();
      
              const {name,email} = inpval;
      
              const res2 = await fetch(`http://localhost:8003/updateuser/${id}`,{
                  method: "PATCH",
                  headers: {
                      "Content-Type": "application/json"
                  },
                  body:JSON.stringify({
                      name,email,flowKey
                  })
              });
      
              const data2 = await res2.json();
              console.log(data2);
      
              if(res2.status === 422 || !data2){
                  alert("fill the data");
              }else{
                  history.push("/")
                  setUPdata(data2);
              }
      
          }

    }

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [rfInstance, setRfInstance] = useState(null);
  const { setViewport } = useReactFlow();

  const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

  const onRestore = useCallback(() => {
    const restoreFlow = async () => {
      const flow = flowKeyData;

      if (flow) {
        const { x = 0, y = 0, zoom = 1 } = flow.viewport;
        setNodes(flow.nodes || []);
        setEdges(flow.edges || []);
        setViewport({ x, y, zoom });
      }
    };

    restoreFlow();
  }, [setNodes, setViewport]);

  const onAdd = useCallback(() => {
    const newNode = {
      id: getNodeId(),
      data: { label: 'Added node' },
      position: {
        x: Math.random() * window.innerWidth - 100,
        y: Math.random() * window.innerHeight,
      },
    };
    setNodes((nds) => nds.concat(newNode));
  }, [setNodes]);

  return (
    <ReactFlow
      style={graphStyles}
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      onInit={setRfInstance}
    >
      <div className="save__controls">
        <button onClick={updateuser}>save</button>
        <button onClick={onRestore}>restore</button>
        <button onClick={onAdd}>add node</button>
      </div>
    </ReactFlow>
  );
};

export default () => (
  <ReactFlowProvider>
    <SaveRestore />
  </ReactFlowProvider>
);
