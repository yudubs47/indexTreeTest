import IndexTree from "./components/indexTree";

const data = {
  id: '0',
  children: [
    {
      id: '00',
      children: [
        {
          id: '000',
          children: [
            {
              id: '0000',
              children: []
            },
          ] 
        },
        {
          id: '001',
          children: [
            {
              id: '0010',
              children: []
            },
          ] 
        }
      ]
    },
    { id: '01', children: [] },
    {
      id: '02',
      children: [
        {
          id: '020',
          children: []
        },
        {
          id: '021',
          children: [
            {
              id: '0210',
              children: []
            },
          ]
        },
      ] 
    }
  ]
}

const tree = new IndexTree(data)
console.log(tree.getAllIndex())
