import dayjs from "dayjs";
import { ObjectId } from "mongodb";
import  db  from "../database/database.connection.js";

export async function newPolls(req, res) {
  const { title, expireAt } = req.body;

  const expire = expireAt
    ? dayjs(expireAt).format("YYYY-MM-DD HH:mm")
    : dayjs().add(30, "day").format("YYYY-MM-DD HH:mm");

  try {
    const poll = { title, expireAt: expire };
    await db.collection("polls").insertOne(poll);
    res.status(201).send(poll);
  } catch (error) {
    res.send(error.message);
  }
}


export async function getPolls(req, res) {
    try {
      const pollsGet = await db.collection("polls").find().toArray();
      res.send(pollsGet);
    } catch (error) {
      res.send(error.message);
    }
  }

  
  export async function getChoices(req, res) {
    const { id } = req.params;
  
    try {
      const choices = await db.collection("choices").find({ pollId: id }).toArray();
  
      if (choices.length === 0) {
        return res.status(404).send("A enquete não existe!");
      }
  
      res.send(choices);
    } catch (error) {
      res.send(error.message);
    }
  }


  export async function getResults(req, res) {
    const { id } = req.params;
  
    try {
      const poll = await db.collection("polls").findOne({ _id: new ObjectId(id) });
      if (!poll) {
        return res.status(404).send("A opção não é válida!");
      }

      const choices = await db.collection("choices").find({ pollId: id }).toArray();
      const choicesIds = choices.map(choice => choice._id.toString());
      const votes = await db.collection("votes").find({ choiceId: { $in: choicesIds }}).toArray();

      const voteCount = choices.map((choice) => {
        const count = votes.filter((vote) => vote.choiceId === choice._id.toString()).length;
        return { ...choice, count };
      });
  
      const mostVotedChoice = voteCount.reduce((max, choice) => {
        return choice.count > max.count ? choice : max;
      }, { count: 0 });
  
      const response = {
        _id: poll._id,
        title: poll.title,
        expireAt: poll.expireAt,
        result: {
          title: mostVotedChoice.title,
          votes: mostVotedChoice.count,
        },
      };
  
      res.status(200).send(response);
    } catch (error) {
      res.send(error.message);
    }
  }