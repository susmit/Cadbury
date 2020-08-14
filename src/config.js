export const CADBURY_ADDRESS = '0x8B2090fAd5339baA659b004525E1440308159193'

export const CADBURY_ABI = [
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'num',
        type: 'uint256',
      },
    ],
    name: 'rate',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'GetRatings',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'totalPeople',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
]

/// smc on kovan

// pragma solidity >=0.4.22 <0.7.0;

// /**
//  * @title Ratings
//  * To store and get ratings for Cadbury
//  */
// contract CadburyRatings {

//     uint256 totalRatings = 5;
//     uint256 totalApplication = 1;

//     function rate(uint256 num) public {
//         require(num >= 0 && num <= 5 );
//         totalRatings = totalRatings + num ;
//         totalApplication = totalApplication + 1 ;
//     }

//     function GetRatings() public view returns (uint256){
//         return ( totalRatings * 1000 ) /totalApplication;
//     }

//     function totalPeople() public view returns (uint256){
//         return totalApplication;
//     }
// }
