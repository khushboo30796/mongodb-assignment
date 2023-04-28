class Graph {
   constructor() {
      this.edges = {};
      this.nodes = [];
   }
   addNode(node) {
      this.nodes.push(node);
      this.edges[node] = [];
   }
   addEdge(node1, node2) {
      this.edges[node1].push(node2);
      this.edges[node2].push(node1);
   }
   djikstraAlgorithm(startNode) {
      let distances = [];
      let prev = {};
      let pq = new PriorityQueue(this.noOfVertices * this.noOfVertices);
   
      // Set distances to all nodes to be infinite except startNode
      distances.push({"node": startNode, "distance": 0});
      pq.enqueue(startNode, 0);
      this.nodes.forEach(node => {
         if (node !== startNode) distances.push({"node" : node, "distance" : Infinity});
         prev[node] = null;
      });
   
      while (!pq.isEmpty()) {
         let minNode = pq.dequeue();
          let currNode = minNode.element;
          let weight = 1;
         this.edges[currNode].forEach(neighbor => {
            let alt = distances.find(distance => {return distance.node == currNode}).distance + 1;
            let ndist = distances.findIndex(distance => {return distance.node == neighbor});
            if (alt < distances[ndist].distance) { 
              distances[ndist].distance = alt;
              prev[neighbor] = currNode;
              pq.enqueue(neighbor, distances[ndist].distance);
           }
        });
      
     }
     return distances;
  }
   // display() {
   //    let graph = ""; this.nodes.forEach(node => {
   //       graph += node + "->" + this.edges[node].join(", ") + "\n";
   //    });
   //    var fs = require('fs');

   //    fs.writeFile('mynewfile3.txt', JSON.stringify(this), function (err) {
   //       if (err) throw err;
   //       console.log('Saved!');
   //     });


   //}
}
class QueueElement {
   constructor(elem, priNo) {
   this.element = elem;
   this.priority = priNo;
   }
}
class PriorityQueue {
   constructor() {
      this.queArr = [];
   }
   enqueue(elem, priNo) {
      let queueElem = new QueueElement(elem, priNo);
      let contain = false;
      for (let i = 0; i < this.queArr.length; i++) {
         if (this.queArr[i].priority > queueElem.priority) {
            this.queArr.splice(i, 0, queueElem);
            contain = true;
            break;
         }
      }
      if (!contain) {
         this.queArr.push(queueElem);
      }
   }
   dequeue() {

      if (this.isEmpty()) return null;
      return this.queArr.shift();
   }
   isEmpty() {
      return this.queArr.length == 0;
   }
   display() {
      let res_Str = "";
      for (let i = 0; i < this.queArr.length; i++)
      res_Str += this.queArr[i].element + " ";
      return res_Str;
   }
}
const usersRepo = require('./usersRepo');
async function makeGraph(userId)
{
   let g = new Graph();
   const userIds = await usersRepo.getUsers({},{name:0, phone:0},0);
   const blogs = await usersRepo.getBlogs({},{comments:1},0);
   userIds.forEach(userId => {
      g.addNode(JSON.stringify(userId._id)); 
   });
   userIds.forEach(userId => { 
      const neighbours = new Set();
      blogs.forEach(blog => {
         let flag = false;
         for(let i=0;i<blog.comments.length;i++)
         {
            if(blog.comments[i].user === userId._id)
            {
               flag = true;
               break;
            }
         }
         if(flag == true)
         {
            for(let i=0;i<blog.comments.length;i++)
            {
               if(blog.comments[i].user !== userId._id)
               {
                  neighbours.add(blog.comments[i].user);
               }
            }            
         }

      });
      neighbours.forEach(neighbour => {
         g.addEdge(JSON.stringify(userId._id), JSON.stringify(neighbour));
      });
   });
   return g.djikstraAlgorithm(JSON.stringify(userId));
   //console.log(g.djikstraAlgorithm(JSON.stringify(userIds[0]._id)));
}
async function friends(userId, level)
{
   const friendList = [];
   const distances = await makeGraph(userId);
   distances.forEach(distance =>
   {
      if(distance.distance == level)
         friendList.push(distance.node);
   });
   return friendList;  

}

module.exports = {friends};