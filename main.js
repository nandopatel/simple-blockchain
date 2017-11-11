const SHA256 = require('crypto-js/sha256'); //requires sha

class Block{
    constructor(index, timestamp, data, previousHash= ''){
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();           //block data
    }

    calculateHash(){
        return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data)).toString();  //calculates hash of the block data
    }
}

class Blockchain{
    constructor(){
        this.chain = [this.createGenesisBlock()];
    }
    createGenesisBlock(){
    return new Block(0, "15/11/2017", "Genesis block", "0");    //creates genesis block (index, timestamp, somedata, prevhash) (in genesis blocks' case it just hashes some random data eg:0)
    }

    getLatestBlock(){
        return this.chain[this.chain.length - 1];       //returns latest block which is of the -1 index of the array
    }

    addBlock(newBlock){
        newBlock.previousHash = this.getLatestBlock().hash; //gets previous block hash
        newBlock.hash = newBlock.calculateHash();           //calculates hash of new block
        this.chain.push(newBlock);                          //then pushes it to the chain
    }

    isChainValid(){
        for(let i=1; i < this.chain.length; i++){           //loop over entire chain
            const currentBlock = this.chain[i];             //current block
            const previousBlock = this.chain[i - 1];        //previous block

            if(currentBlock.hash !== currentBlock.calculateHash()){     //if currentblock hash != the recalculated hash of the current block
                return false;                                           //validity is lost
            }

            if(currentBlock.previousHash !== previousBlock.hash){       //if current block prev hash is not equal to its hash
                return false;                                           //validity is lost
            }
        }

        return true;                                                    //valid
    }
}

Sapphire = new Blockchain();                                            //create BC
Sapphire.addBlock(new Block(1,"11/11/2017", {amount: 4}));
Sapphire.addBlock(new Block(2,"12/11/2017", {amount: 3}));              //adding blocks

console.log('valid?: ' + Sapphire.isChainValid());                      //validity response
console.log(JSON.stringify(Sapphire, null, 4));                         //prints block data

Sapphire.chain[1].data = {amount: 100};                                 //example of an attacker trying to overwrite block data, eg: send 100
console.log('valid?: ' + Sapphire.isChainValid());                      //when this is done we can see that this breaks the chain as the future hashes become 'unlinked to genesis'
                                                                        //what if the attacker recalculates the hash of the block they have just changed?
Sapphire.chain[1].hash = Sapphire.chain[1].calculateHash();
console.log('valid?: ' + Sapphire.isChainValid());                      //still invalid - this is because tampering with one block breaks the relationship with its previous block
                                                                        //this is the beauty of blockchain - Immutability!
