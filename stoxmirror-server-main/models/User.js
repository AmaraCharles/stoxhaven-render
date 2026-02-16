const mongoose = require("mongoose");

const ChallengeSchema = new mongoose.Schema({
  challengeId: String,
  title: String,
  entryFee: Number,
  duration: Number,
  expectedProfitRate: String,
  minProfit: Number,
  reward: String,
  profit: { type: Number, default: 0 },
  daysLeft: Number,
  joinedAt: { type: Date, default: Date.now },
  isCompleted: { type: Boolean, default: false },
  rewardClaimed: { type: Boolean, default: false }
});

const UsersSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  copytrading: {
    type: String,
    
  },
  zip: {
    type: String,
    
  },
  address: {
    type: String,
    
  },
  phone: {
    type: String,
    
  },
  rank: {
    type: String,
    
  },
  state: {
    type: String,
    
  },
  server: {
    type: String,
    
  },
  city: {
    type: String,
    
  },
  mobile: {
    type: String,
    
  },
  trader: {
    type: String,
    
  },
  condition: {
    type: String,
    
  },
  trades: {
    type: Array,
    
  },
  kyc: {
    type: String,
    
  },
  country: {
    type: String,
    
  },



  email: {
    type: String,
    required: true,
    unique: true,
  },
  referralCode:{
    type:String,
  },
  referredUsers:{
    type:Array,
  },
  planHistory:{
    type:Array,
  },
  referredBy:{
    type:String,
  },
  plan:{
    type:Array,
  },
  state:{
    type:String,
  },
 
  state:{
    type:String,
  },
 
  city: {
    type: String,
    
  },

  zip:{
    type:Object,
  },
  address:{
    type:Object,
  },
 
  password: {
    type: String,
    required: true,
    min: 6,
    max: 50,
  },
  amountDeposited: {
    type: String,
  },
  profit: {
    type: String,
  },
  balance: {
    type: Number,
  },
  referalBonus: {
    type: String,
  },
  transactions: {
    type: Array,
  },
   challengeBalance: { type: Number, default: 0 },
   challengeTransactions: {
    type: Array,
  },
   challengeWithdrawals: { type: Array, default: [] },
    challenges: { type: [ChallengeSchema], default: [] },
  accounts: {
    type: Object,
  },
  withdrawals: {
    type: Array,
  },
  verified: {
    type: Boolean,
  },
  isDisabled: {
    type: Boolean,
  },
});

module.exports = mongoose.model("users", UsersSchema);
