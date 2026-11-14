const Task = require("../models/task");

exports.getTasks = async (req, res, next) => {
    try{
        const tasks = await Task.find({user: req.user._id}).sort({ createdAt: -1});
        res.json(tasks);
    } catch(err){
        next(err);
    }
};

exports.createTask = async (req, res, next) => {
    try{
        const { title } = req.body;
        if (!title) return res.status(400).json({message: "Title is required"});

        const task = await Task.create({ title, user:req.user._id });
        res.status(201).json(task);
    }catch(err){
        next(err);
    }
};

exports.updateTask = async (req, res, next) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!task) return res.status(404).json({ message: "Task not found" });

    res.json(task);
  } catch (err) {
    next(err);
  }
};

exports.deleteTask = async (req, res, next) => {
    try{
        const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user._id });
        if(!task)
            return res.status(404).json({message: "Task Not Found"});
        res.json({message: "Task Deleted"});
    } catch(err){
        next(err);
    }
};