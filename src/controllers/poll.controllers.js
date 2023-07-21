import dayjs from "dayjs";
import { ObjectId } from "mongodb";
import  db  from "../database/database.connection.js";

export async function newPolls(req, res) {
  const { title, expireAt } = req.body;

  if (title === "") {
    return res.status(422).send("O título não pode estar vazio!");
  }

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

  
  export async function getChoice(req, res) {
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


  export async function getResul(req, res) {
    const { id } = req.params;
  
    try {
      const poll = await db.collection("polls").findOne({ _id: new ObjectId(id) });
  
      if (!poll) {
        return res.status(404).send("A enquete não existe!");
      }
      const choices = await db.collection("choices").find({ pollId: id }).toArray();
      const ids = choices.map(choice => choice._id.toString());
  
      const vote = await db.collection("votes").find({ choiceId: { $in: ids }}).toArray();
  
      const count = choices.map((choice) => {
        const countVote = vote.filter((vote) => vote.choiceId === choice._id.toString()).length;
        return { ...choice, count };
      });
  
      const voted = count.reduce((max, choice) => {
        return choice.countVote > max.countVote ? choice : max;
      }, { count: 0 });
  
      const response = {
        _id: poll._id,
        title: poll.title,
        expireAt: poll.expireAt,
        result: {
          title: voted.title,
          votes: voted.count,
        },
      };
  
      res.status(200).send(response);
    } catch (error) {
      res.send(error.message);
    }
  }