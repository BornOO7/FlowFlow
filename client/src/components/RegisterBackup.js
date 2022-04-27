import React, { useState, useRef, useCallback, useContext } from 'react';
import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
} from 'react-flow-renderer';
import { NavLink, useHistory } from 'react-router-dom'
import { adddata } from './context/ContextProvider';

import Sidebar from './Sidebar';

import './dndflow.css';

const initialNodes = [];

let id = 0;
const getId = () => `dndnode_${id++}`;
const graphStyles = { width: "100%", height: "500px" };

const DnDFlow = () => {
  const { udata, setUdata } = useContext(adddata);

    const history = useHistory();

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

  const hello = () => 'hello'
  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);

  const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), []);

  const addinpdata = async (e) => {
    e.preventDefault();
    const flowKey = reactFlowInstance.toObject()
    console.log('flowkey', flowKey)

    const { name, email } = inpval;

    const res = await fetch("http://localhost:8003/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            name, email, flowKey
        })
    });

    const data = await res.json();
    console.log('hello');

    if (res.status === 422 || !data) {
        console.log("error ");
        alert("error");

    } else {
        history.push("/")
        setUdata(data)
        console.log("data added");

    }
}

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const type = event.dataTransfer.getData('application/reactflow');

      // check if the dropped element is valid
      if (typeof type === 'undefined' || !type) {
        return;
      }

      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });
      const newNode = {
        id: getId(),
        type,
        position,
        data: { label: `${type} node` },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance]
  );

  return (
    <div className="dndflow">
      <NavLink to="/">home</NavLink>
    
    <div className="row">
        <div class="mb-3 col-lg-6 col-md-6 col-12">
            <label for="exampleInputEmail1" class="form-label">Name</label>
            <input type="text" value={inpval.name} onChange={setdata} name="name" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" />
        </div>
        <div class="mb-3 col-lg-6 col-md-6 col-12">
            <label for="exampleInputPassword1" class="form-label">email</label>
            <input type="email" value={inpval.email} onChange={setdata} name="email" class="form-control" id="exampleInputPassword1" />
        </div>

        
    </div>
      <ReactFlowProvider>
        <div className="reactflow-wrapper" ref={reactFlowWrapper}>
          <ReactFlow
            style={graphStyles}
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onInit={setReactFlowInstance}
            onDrop={onDrop}
            onDragOver={onDragOver}
            fitView
          >
            <div className="save__controls">
        <button onClick={addinpdata}>save</button>
      </div>
            <Controls />
          </ReactFlow>
        </div>
        <Sidebar />
      </ReactFlowProvider>
    </div>
  );
};

export default DnDFlow;
