const UsersDatabase = require("../../models/User");
var express = require("express");
var router = express.Router();
const { sendDepositEmail,sendPlanEmail} = require("../../utils");
const { sendUserDepositEmail,sendDepositApproval,sendNotifyEmail,sendUserPlanEmail,sendWalletInfo,sendWithdrawalEmail,sendWithdrawalRequestEmail,sendKycAlert} = require("../../utils");

const { v4: uuidv4 } = require("uuid");
const app=express()



router.post("/:_id/Tdeposit", async (req, res) => {
  const { _id } = req.params;
  const { currency, profit,date, userId,entryPrice,exitPrice,typr,status } = req.body;
const email=_id
  const user = await UsersDatabase.findOne({ email });

  if (!user) {
    res.status(404).json({
      success: false,
      status: 404,
      message: "User not found",
    });

    return;
  }

  try {
    await user.updateOne({
      planHistory: [
        ...user.planHistory,
        {
          _id: uuidv4(),
          currency,
          entryPrice,
          typr,
          status,
          exitPrice,
        profit,
        date,
        },
      ],
    });

    res.status(200).json({
      success: true,
      status: 200,
      message: "Deposit was successful",
    });

   

   

  } catch (error) {
    console.log(error);
  }
});


router.post("/:_id/deposit", async (req, res) => {
  const { _id } = req.params;
  const { method, amount, from ,timestamp,to} = req.body;

  const user = await UsersDatabase.findOne({ _id });

  if (!user) {
    res.status(404).json({
      success: false,
      status: 404,
      message: "User not found",
    });

    return;
  }

  try {
    await user.updateOne({
      transactions: [
        ...user.transactions,
        {
          _id: uuidv4(),
          method,
          type: "Deposit",
          amount,
          from,
          status:"pending",
          timestamp,
        },
      ],
    });

    res.status(200).json({
      success: true,
      status: 200,
      message: "Deposit was successful",
    });

    sendDepositEmail({
      amount: amount,
      method: method,
      from: from,
      timestamp:timestamp
    });


    sendUserDepositEmail({
      amount: amount,
      method: method,
      from: from,
      to:to,
      timestamp:timestamp
    });

  } catch (error) {
    console.log(error);
  }
});

router.post("/:_id/deposit/notify", async (req, res) => {
  const { _id } = req.params;
  const { name, currency } = req.body;

  // Validate input
  if (!name || !currency) {
    return res.status(400).json({
      success: false,
      status: 400,
      message: "Missing required fields: name or currency.",
    });
  }

  try {
    // Find the user
    const user = await UsersDatabase.findOne({ _id });
    if (!user) {
      return res.status(404).json({
        success: false,
        status: 404,
        message: "User not found",
      });
    }

    // Send success response
    res.status(200).json({
      success: true,
      status: 200,
      message: "Deposit was successful",
    });

    // Send notification email
    sendNotifyEmail({
      currency: currency,
      name: name,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      status: 500,
      message: "An error occurred while processing the request.",
    });
  }
});


router.post("/:_id/plan", async (req, res) => {
  const { _id } = req.params;
  const { subname, subamount, from ,timestamp,to} = req.body;

  const user = await UsersDatabase.findOne({ _id });

  if (!user) {
    res.status(404).json({
      success: false,
      status: 404,
      message: "User not found",
    });

    return;
  }
  try {
    // Calculate the new balance by subtracting subamount from the existing balance
    const newBalance = user.balance - subamount;

    await user.updateOne({
      planHistory: [
        ...user.planHistory,
        {
          _id: uuidv4(),
          subname,
          subamount,
          from,
          timestamp,
        },
      ],
      balance: newBalance, // Update the user's balance
    });



    res.status(200).json({
      success: true,
      status: 200,
      message: "Deposit was successful",
    });

    sendPlanEmail({
      subamount: subamount,
      subname: subname,
      from: from,
      timestamp:timestamp
    });


    sendUserPlanEmail({
      subamount: subamount,
      subname: subname,
      from: from,
      to:to,
      timestamp:timestamp
    });

  } catch (error) {
    console.log(error);
  }
});


router.post("/:_id/auto", async (req, res) => {
  const { _id } = req.params;
  const { copysubname, copysubamount, from ,timestamp,to,trader,info} = req.body;

  const user = await UsersDatabase.findOne({ _id });

  if (!user) {
    res.status(404).json({
      success: false,
      status: 404,
      message: "User not found",
    });

    return;
  }
  try {
    // Calculate the new balance by subtracting subamount from the existing balance
    // const newBalance = user.balance - copysubamount;

    await user.updateOne({
      plan: [
        ...user.plan,
        {
          _id: uuidv4(),
          subname:copysubname,
          subamount:copysubamount,
          from,
          trader,
          info,
          status:"pending",
          timestamp,
        },
      ],
      // balance: newBalance, // Update the user's balance
    });



    res.status(200).json({
      success: true,
      status: 200,
      message: "Deposit was successful",
    });

    sendPlanEmail({
      subamount: copysubamount,
      subname: copysubname,
      from: from,
      trader,
      timestamp:timestamp
    });


    sendUserPlanEmail({
      subamount: copysubamount,
      subname: copysubname,
      from: from,
      to:to,
      trader,
      timestamp:timestamp
    });

  } catch (error) {
    console.log(error);
  }
});

router.post("/:_id/wallet", async (req, res) => {
  const { _id } = req.params;
  const { addy} = req.body;
  const { wally} = req.body;

  const user = await UsersDatabase.findOne({ _id });
const username=user.firstName + user.lastName
  if (!user) {
    res.status(404).json({
      success: false,
      status: 404,
      message: "User not found",
    });

    return;
  }
  try {
    // Calculate the new balance by subtracting subamount from the existing balance
    
    await user.updateOne({
      plan: addy, // Update the user's wallet
    });



    res.status(200).json({
      success: true,
      status: 200,
      message: "wallet was successful saved",
    });


    sendWalletInfo({
      username,
      addy,
      wally,
    })
  } catch (error) {
    console.log(error);
  }
});



router.put("/:_id/transaction/:transactionId/confirm", async (req, res) => {
  const { _id, transactionId} = req.params;
  const {amount}=req.body

  try {
    // Find the user by _id
    const user = await UsersDatabase.findOne({ _id });

    if (!user) {
      return res.status(404).json({
        success: false,
        status: 404,
        message: "User not found",
      });
    }

    // Find the deposit transaction by transactionId
    const depositsArray = user.transactions;
    const depositsTx = depositsArray.filter((tx) => tx._id === transactionId);

    // If the transaction was not found
    if (depositsTx.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found",
      });
    }

    depositsTx[0].status = "Approved";
    depositsTx[0].amount = amount;
    
    const newBalance = Number(user.balance) + Number(amount);

    // Update user balance and transaction status
    await user.updateOne({
      transactions: [
        ...user.transactions,
        // cummulativeWithdrawalTx, // If needed, you can add logic here
      ],
      balance: newBalance,
          });

    // Send deposit approval notification (optional)
    sendDepositApproval({
      amount: depositsTx[0].amount,
      method: depositsTx[0].method,
      timestamp: depositsTx[0].timestamp,
      to: user.email, // assuming 'to' is the user's email or similar
    });

    // Return success response
    return res.status(200).json({
      message: "Transaction approved",
    });

  } catch (error) {
    console.error(error); // Log any error that occurs
    return res.status(500).json({
      message: "Oops! an error occurred",
    });
  }
});

router.post("/:_id/deposit/challenge", async (req, res) => {
  const { _id } = req.params;
  const { method, amount, from ,timestamp,to} = req.body;

  const user = await UsersDatabase.findOne({ _id });

  if (!user) {
    res.status(404).json({
      success: false,
      status: 404,
      message: "User not found",
    });

    return;
  }

  try {
    await user.updateOne({
      challengeTransactions: [
        ...user.challengeTransactions,
        {
          _id: uuidv4(),
          method,
          type: "Deposit",
          amount,
          from,
          status:"pending",
          timestamp,
        },
      ],
    });

    res.status(200).json({
      success: true,
      status: 200,
      message: "Deposit was successful",
    });

    sendDepositEmail({
      amount: amount,
      method: method,
      from: from,
      timestamp:timestamp
    });


    sendUserDepositEmail({
      amount: amount,
      method: method,
      from: from,
      to:to,
      timestamp:timestamp
    });

  } catch (error) {
    console.log(error);
  }
});

router.post("/users/:userId/challenges/join", async (req, res) => {
  try {
    const { userId } = req.params;
    let { challenge } = req.body;

    if (!challenge || typeof challenge !== "object") {
      return res.status(400).json({ error: "Invalid challenge data" });
    }

    const user = await UsersDatabase.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    if (user.challengeBalance < challenge.entryFee) {
      return res.status(400).json({ error: "Not enough challenge balance" });
    }

    // Deduct balance
    user.challengeBalance -= challenge.entryFee;

    // 🚨 Explicitly build object that matches ChallengeSubSchema
    const challengeToAdd = {
      challengeId: String(challenge.challengeId || challenge.id), // support both
      title: String(challenge.title),
      entryFee: Number(challenge.entryFee),
      duration: Number(challenge.duration || challenge.durationDays),
      expectedProfitRate: String(challenge.expectedProfitRate),
      minProfit: Number(challenge.minProfit),
      reward: String(challenge.reward),
      profit: 0,
      daysLeft: Number(challenge.duration || challenge.durationDays),
      joinedAt: new Date(),
      isCompleted: false,
      rewardClaimed: false
    };

    console.log("ChallengeToAdd:", challengeToAdd);

    user.challenges.push(challengeToAdd);

    await user.save();
    res.json({ message: "Challenge joined successfully", user });
  } catch (err) {
    console.error("Join challenge error:", err);
    res.status(500).json({ error: err.message });
  }
});



router.post("/users/:userId/challenges/:challengeId/claim", async (req, res) => {
  try {
    const { userId, challengeId } = req.params;

    const user = await UsersDatabase.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    const challenge = user.challenges.find(c => c._id.toString() === challengeId);
    if (!challenge) return res.status(404).json({ error: "Challenge not found" });

    if (user.challengeProfit < challenge.minProfit) {
      return res.status(400).json({ error: "Profit target not reached" });
    }

    if (challenge.rewardClaimed) {
      return res.status(400).json({ error: "Reward already claimed" });
    }

    // Apply reward
    if (challenge.reward.includes("x2")) {
      user.challengeBalance += challenge.profit * 2;
    } else if (challenge.reward.includes("$")) {
      const amount = parseInt(challenge.reward.replace(/\D/g, ""));
      user.challengeBalance += amount;
    }

    challenge.rewardClaimed = true;
    await user.save();

    res.json({ message: "Reward claimed successfully", balance:  user.challengeBalance });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



router.put("/:_id/transaction/:transactionId/decline", async (req, res) => {
  
  const { _id } = req.params;
  const { transactionId } = req.params;

  const user = await UsersDatabase.findOne({ _id });

  if (!user) {
    res.status(404).json({
      success: false,
      status: 404,
      message: "User not found",
    });

    return;
  }

  try {
    const depositsArray = user.transactions;
    const depositsTx = depositsArray.filter(
      (tx) => tx._id === transactionId
    );

    depositsTx[0].status = "Declined";
    // console.log(withdrawalTx);

    // const cummulativeWithdrawalTx = Object.assign({}, ...user.withdrawals, withdrawalTx[0])
    // console.log("cummulativeWithdrawalTx", cummulativeWithdrawalTx);

    await user.updateOne({
      transactions: [
        ...user.transactions
        //cummulativeWithdrawalTx
      ],
    });

    res.status(200).json({
      message: "Transaction declined",
    });

    return;
  } catch (error) {
    res.status(302).json({
      message: "Opps! an error occured",
    });
  }
});


router.put("/:_id/planhistory/:planId/confirm", async (req, res) => {
  
  const { _id } = req.params;
  const { planId } = req.params;
  const { copysub } = req.body;
  const user = await UsersDatabase.findOne({ _id });

  if (!user) {
    res.status(404).json({
      success: false,
      status: 404,
      message: "User not found",
    });

    return;
  }

  try {
    const depositsArray = user.planHistory;
    const depositsTx = depositsArray.filter(
      (tx) => tx._id === planId
    );

    depositsTx[0].status = "Approved";
    const newBalance = user.balance - copysub;

    // console.log(withdrawalTx);

    // const cummulativeWithdrawalTx = Object.assign({}, ...user.withdrawals, withdrawalTx[0])
    // console.log("cummulativeWithdrawalTx", cummulativeWithdrawalTx);

    await user.updateOne({
      planHistory: [
        ...user.planHistory
        //cummulativeWithdrawalTx
      ],
      balance: newBalance,
    });

    res.status(200).json({
      message: "Transaction approved",
    });

    return;
  } catch (error) {
    res.status(302).json({
      message: "Opps! an error occured",
    });
  }
});


router.put("/:_id/transactions/:transactionId/confirm/challenge", async (req, res) => {
  const { _id, transactionId } = req.params;
  // const { amount } = req.body;

  try {
    // Find the user by _id
    const user = await UsersDatabase.findOne({ _id });

    if (!user) {
      return res.status(404).json({
        success: false,
        status: 404,
        message: "User not found",
      });
    }

    // Find the deposit transaction by transactionId
    const depositsArray = user.challengeTransactions;
    const depositsTx = depositsArray.filter((tx) => tx._id === transactionId);

    if (depositsTx.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found",
      });
    }

    // Update transaction and user balance
    depositsTx[0].status = "Approved";
    
    const newBalance = parseFloat(user.challengeBalance) + parseFloat(depositsTx[0].amount);

    await user.updateOne({
      challengeTransactions: [...user.challengeTransactions],
      challengeBalance: newBalance,
    });

    // Send deposit approval notification
    try {
      await sendDepositApproval({
    
        method: depositsTx[0].method,
        amount:   depositsTx[0].amount,
        timestamp: depositsTx[0].timestamp,
        to: user.email,
      });
    } catch (emailError) {
      console.error("Error sending email:", emailError);
      return res.status(500).json({
        message: "Transaction approved but failed to send email",
        error: emailError.message,
      });
    }

    // Return success response
    return res.status(200).json({
      message: "Transaction approved",
    });
    
  } catch (error) {
    console.error("Error during transaction processing:", error);
    return res.status(500).json({
      message: "Oops! an error occurred",
      error: error.message,
    });
  }
});


router.put("/:_id/transactions/:transactionId/decline/challenge", async (req, res) => {
  
  const { _id } = req.params;
  const { transactionId } = req.params;

  const user = await UsersDatabase.findOne({ _id });

  if (!user) {
    res.status(404).json({
      success: false,
      status: 404,
      message: "User not found",
    });

    return;
  }

  try {
    const depositsArray = user.challengeTransactions;
    const depositsTx = depositsArray.filter(
      (tx) => tx._id === transactionId
    );

    depositsTx[0].status = "Declined";
    // console.log(withdrawalTx);

    // const cummulativeWithdrawalTx = Object.assign({}, ...user.withdrawals, withdrawalTx[0])
    // console.log("cummulativeWithdrawalTx", cummulativeWithdrawalTx);

    await user.updateOne({
      challengeTransactions: [
        ...user.challengeTransactions
        //cummulativeWithdrawalTx
      ],
    });

    res.status(200).json({
      message: "Transaction declined",
    });

    return;
  } catch (error) {
    res.status(302).json({
      message: "Opps! an error occured",
    });
  }
});


router.put("/:_id/planhistory/:planId/decline", async (req, res) => {
  
  const { _id } = req.params;
  const { planId } = req.params;

  const user = await UsersDatabase.findOne({ _id });

  if (!user) {
    res.status(404).json({
      success: false,
      status: 404,
      message: "User not found",
    });

    return;
  }

  try {
    const depositsArray = user.planHistory;
    const depositsTx = depositsArray.filter(
      (tx) => tx._id === planId
    );

    depositsTx[0].status = "Declined";
    // console.log(withdrawalTx);

    // const cummulativeWithdrawalTx = Object.assign({}, ...user.withdrawals, withdrawalTx[0])
    // console.log("cummulativeWithdrawalTx", cummulativeWithdrawalTx);

    await user.updateOne({
      planHistory: [
        ...user.planHistory
        //cummulativeWithdrawalTx
      ],
    });

    res.status(200).json({
      message: "Transaction declined",
    });

    return;
  } catch (error) {
    res.status(302).json({
      message: "Opps! an error occured",
    });
  }
});





router.get("/:_id/deposit/history", async (req, res) => {
  const { _id } = req.params;

  const user = await UsersDatabase.findOne({ _id });

  if (!user) {
    res.status(404).json({
      success: false,
      status: 404,
      message: "User not found",
    });

    return;
  }

  try {
    res.status(200).json({
      success: true,
      status: 200,
      data: [...user.transactions],
    });

  
  } catch (error) {
    console.log(error);
  }
});


router.get("/:_id/deposit/plan/history", async (req, res) => {
  const { _id } = req.params;

  const user = await UsersDatabase.findOne({ _id });

  if (!user) {
    res.status(404).json({
      success: false,
      status: 404,
      message: "User not found",
    });

    return;
  }

  try {
    res.status(200).json({
      success: true,
      status: 200,
      data: [...user.planHistory],
    });

  
  } catch (error) {
    console.log(error);
  }
});


router.post("/kyc/alert", async (req, res) => {
  const {firstName} = req.body;

  

  try {
    res.status(200).json({
      success: true,
      status: 200,
     message:"admin alerted",
    });

    sendKycAlert({
      firstName
    })
  
  } catch (error) {
    console.log(error);
  }
});


router.post("/:_id/withdrawal", async (req, res) => {
  const { _id } = req.params;
  const { method, address, amount, from ,account,to,timestamp} = req.body;

  const user = await UsersDatabase.findOne({ _id });

  if (!user) {
    res.status(404).json({
      success: false,
      status: 404,
      message: "User not found",
    });

    return;
  }

  try {
    await user.updateOne({
      withdrawals: [
        ...user.withdrawals,
        {
          _id: uuidv4(),
          method,
          address,
          amount,
          from,
          account,
          status: "pending",
          timestamp
        },
      ],
    });

    res.status(200).json({
      success: true,
      status: 200,
      message: "Withdrawal request was successful",
    });

    sendWithdrawalEmail({
      amount: amount,
      method: method,
     to:to,
      address:address,
      from: from,
    });

    sendWithdrawalRequestEmail({
      amount: amount,
      method: method,
      address:address,
      from: from,
    });
  } catch (error) {
    console.log(error);
  }
});

// router.put('/approve/:_id', async (req,res)=>{
//   const { _id} = req.params;
//   const user = await UsersDatabase();
//   const looper=user.map(function (userm){
  
//     const withdd=userm.withdrawal.findOne({_id})
  
//   withdd.status="approved"
//    })
//    looper();

//    res.send({ message: 'Status updated successfully', data });

// })

// // endpoint for updating status
// router.put('/update-status/:userId/:_id', async (req, res) => {

//   const { _id} = req.params; // get ID from request parameter
//   const { userId}=req.params;
//   // const user = await UsersDatabase.findOne({userId}); // get array of objects containing ID from request body


//   const withd=user.withdrawals.findOne({_id})
// user[withd].status="approved"
 

// // find the object with the given ID and update its status property
//   // const objIndex = data.findIndex(obj => obj._id === _id);
//   // data[objIndex].status = 'approved';

//   // send updated data as response

//   if (!userId) {
//     res.status(404).json({
//       success: false,
//       status: 404,
//       message: "User not found",
//     });

//     return;
//   }

//   res.send({ message: 'Status updated successfully', data });
// });

router.put("/:_id/withdrawals/:transactionId/confirm", async (req, res) => {
  
  const { _id } = req.params;
  const { transactionId } = req.params;

  const user = await UsersDatabase.findOne({ _id });

  if (!user) {
    res.status(404).json({
      success: false,
      status: 404,
      message: "User not found",
    });

    return;
  }

  try {
    const withdrawalsArray = user.withdrawals;
    const withdrawalTx = withdrawalsArray.filter(
      (tx) => tx._id === transactionId
    );

    withdrawalTx[0].status = "Approved";
    // console.log(withdrawalTx);

    // const cummulativeWithdrawalTx = Object.assign({}, ...user.withdrawals, withdrawalTx[0])
    // console.log("cummulativeWithdrawalTx", cummulativeWithdrawalTx);

    await user.updateOne({
      withdrawals: [
        ...user.withdrawals
        //cummulativeWithdrawalTx
      ],
    });

    res.status(200).json({
      message: "Transaction approved",
    });

    return;
  } catch (error) {
    res.status(302).json({
      message: "Opps! an error occured",
    });
  }
});




router.put("/:_id/withdrawals/:transactionId/decline", async (req, res) => {
  
  const { _id } = req.params;
  const { transactionId } = req.params;

  const user = await UsersDatabase.findOne({ _id });

  if (!user) {
    res.status(404).json({
      success: false,
      status: 404,
      message: "User not found",
    });

    return;
  }

  try {
    const withdrawalsArray = user.withdrawals;
    const withdrawalTx = withdrawalsArray.filter(
      (tx) => tx._id === transactionId
    );

    withdrawalTx[0].status = "Declined";
    // console.log(withdrawalTx);

    // const cummulativeWithdrawalTx = Object.assign({}, ...user.withdrawals, withdrawalTx[0])
    // console.log("cummulativeWithdrawalTx", cummulativeWithdrawalTx);

    await user.updateOne({
      withdrawals: [
        ...user.withdrawals
        //cummulativeWithdrawalTx
      ],
    });

    res.status(200).json({
      message: "Transaction Declined",
    });

    return;
  } catch (error) {
    res.status(302).json({
      message: "Opps! an error occured",
    });
  }
});


router.get("/:_id/withdrawals/history", async (req, res) => {
  console.log("Withdrawal request from: ", req.ip);

  const { _id } = req.params;

  const user = await UsersDatabase.findOne({ _id });

  if (!user) {
    res.status(404).json({
      success: false,
      status: 404,
      message: "User not found",
    });

    return;
  }

  try {
    res.status(200).json({
      success: true,
      status: 200,
      data: [...user.withdrawals],
    });
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
