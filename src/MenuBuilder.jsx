import React, { useState } from 'react';
import RcTree from 'rc-tree';
import 'rc-tree/assets/index.css';

const MenuBuilder = () => {
  // State for tree data and selected keys for delete mode
  const [treeData, setTreeData] = useState([
    {
      title: 'Category 1',
      key: '0-0',
      children: [
        { title: 'Subcategory 1-1', key: '0-0-0' },
        { title: 'Subcategory 1-2', key: '0-0-1' },
      ],
    },
    {
      title: 'Category 2',
      key: '0-1',
      children: [
        { title: 'Subcategory 2-1', key: '0-1-0' },
        { title: 'Subcategory 2-2', key: '0-1-1' },
      ],
    },
  ]);

  const [selectedKeys, setSelectedKeys] = useState([]);
  const [multiDeleteMode, setMultiDeleteMode] = useState(false); // For multi-delete mode
  const [allowNewCategory, setAllowNewCategory] = useState(false); // To allow new category after deletion

  // Add a new node (subcategory under a category)
  const addNode = (parentKey, newNodeTitle) => {
    const newNode = {
      title: newNodeTitle,
      key: `${parentKey}-${Date.now()}`,
    };

    // Update the tree data with the new subcategory under the correct parent category
    const updatedData = treeData.map((node) => {
      if (node.key === parentKey) {
        return {
          ...node,
          children: [...(node.children || []), newNode],
        };
      }
      return node;
    });

    setTreeData(updatedData);
  };

  // Add new category (top level)
  const addNewCategory = (newCategoryTitle) => {
    const newCategory = {
      title: newCategoryTitle,
      key: `${Date.now()}`, // Unique key based on current timestamp
      children: [],
    };

    setTreeData((prevData) => [...prevData, newCategory]);
    setAllowNewCategory(false); // Disable add new category button after category added
  };

  // Edit a node (category or subcategory)
  const editNode = (key, newTitle) => {
    const updatedData = treeData.map((node) => {
      if (node.key === key) {
        return {
          ...node,
          title: newTitle,
        };
      }

      if (node.children) {
        node.children = node.children.map((child) =>
          child.key === key ? { ...child, title: newTitle } : child
        );
      }

      return node;
    });

    setTreeData(updatedData);
  };

  // Delete selected nodes (multiple)
  const deleteSelectedNodes = () => {
    const updatedData = treeData
      .map((node) => {
        if (selectedKeys.includes(node.key)) return null;

        if (node.children) {
          node.children = node.children.filter(
            (child) => !selectedKeys.includes(child.key)
          );
        }

        return node;
      })
      .filter((node) => node !== null);

    setTreeData(updatedData);
    setSelectedKeys([]); // Clear selection after deletion
  };

  // Delete Single Node
  const deleteNode = (key) => {
    const updatedData = treeData
      .map((node) => {
        if (node.key === key) return null;

        if (node.children) {
          node.children = node.children.filter((child) => child.key !== key);
        }

        return node;
      })
      .filter((node) => node !== null);

    setTreeData(updatedData);
    setAllowNewCategory(true); // Allow adding a new category after a category is deleted
  };

  // Handle node selection
  const handleNodeSelect = (selectedKeys) => {
    setSelectedKeys(selectedKeys);
  };

  // Handle Edit Node
  const handleEditNode = (key) => {
    const newTitle = prompt('Enter new title for node:');
    if (newTitle) {
      editNode(key, newTitle);
    }
  };

  // Handle Delete Node
  const handleDeleteNode = (key) => {
    if (window.confirm('Are you sure you want to delete this node?')) {
      deleteNode(key);
    }
  };

  // Render Tree Nodes with Edit/Delete buttons
  const renderTreeNodes = (data) => {
    return data.map((node) => (
      <RcTree.TreeNode
        title={
          <div>
            <span>{node.title}</span>
            <button onClick={() => handleEditNode(node.key)} style={{ marginLeft: 10 }}>
              Edit
            </button>
            <button onClick={() => handleDeleteNode(node.key)} style={{ marginLeft: 10 }}>
              Delete
            </button>
            {/* Add subcategory button for categories */}
            {node.children ? (
              <button 
                onClick={() => {
                  const subcategoryTitle = prompt(`Enter subcategory for ${node.title}:`);
                  if (subcategoryTitle) {
                    addNode(node.key, subcategoryTitle); // Add subcategory under current category
                  }
                }}
                style={{ marginLeft: 10 }}
              >
                Add Subcategory
              </button>
            ) : null}
          </div>
        }
        key={node.key}
        selectable={false}
      >
        {node.children ? renderTreeNodes(node.children) : null}
      </RcTree.TreeNode>
    ));
  };

  return (
    <div>
      <h2>Menu Builder</h2>

      {/* Tree view with RcTree */}
      <RcTree
        multiple
        defaultExpandAll
        onSelect={handleNodeSelect}
        selectedKeys={selectedKeys}
        treeData={treeData}
        showLine
      >
        {renderTreeNodes(treeData)}
      </RcTree>

      {/* Options to add new node and toggle multi-delete */}
      <div>
        <button className='add' onClick={() => addNode('0-0', 'New Subcategory')}>
          Add New Node to Category 1
        </button>
        <button  className='add' onClick={() => addNode('0-1', 'New Subcategory')}>
          Add New Node to Category 2
        </button>

        {/* Multi-Delete Toggle */}
        <button  className='add' onClick={() => setMultiDeleteMode(!multiDeleteMode)}>
          {multiDeleteMode ? 'Exit Multi-Delete Mode' : 'Enter Multi-Delete Mode'}
        </button>

        {/* Only show delete button if multi-delete mode is enabled */}
        {multiDeleteMode && (
          <button className='add' onClick={deleteSelectedNodes} disabled={selectedKeys.length === 0}>
            Delete Selected Nodes
          </button>
        )}

        {/* Add new category button */}
        {allowNewCategory && (
          <div>
            <button className='add'
              onClick={() => {
                const newCategoryTitle = prompt('Enter title for new category:');
                if (newCategoryTitle) {
                  addNewCategory(newCategoryTitle);
                }
              }}
            >
              Add New Category
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MenuBuilder;
