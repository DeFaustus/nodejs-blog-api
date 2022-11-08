const { validationResult } = require("express-validator");
const { Op } = require("sequelize");
const model = require("../model/index");
const { upload } = require("../middleware/uploadMiddleware");
module.exports.semuaPost = async (req, res) => {
  try {
    const post = await model.Post.findAll({
      include: [
        {
          model: model.User,
          required: true,
        },
        {
          model: model.Category,
          required: true,
        },
      ],
    });
    res.status(200).json({
      message: "sukses",
      data: post,
    });
  } catch (error) {
    res.status(404).json({
      message: error.message,
    });
  }
};
module.exports.findByJudulDanCategory = async (req, res) => {
  let post = {};
  try {
    console.log(req.query.cat);
    if (req.query.cat && req.query.judul) {
      post = await model.Post.findAll({
        where: {
          "$categories.slug$": {
            [Op.in]: [req.query.cat],
          },
          judul: {
            [Op.like]: `%${req.query.judul}%`,
          },
        },
        include: [model.Category],
      });
    } else if (req.query.cat) {
      post = await model.Post.findAll({
        where: {
          "$categories.slug$": {
            [Op.in]: [req.query.cat],
          },
        },
        include: [model.Category],
      });
    } else if (req.query.judul) {
      post = await model.Post.findAll({
        where: {
          judul: {
            [Op.like]: `%${req.query.judul}%`,
          },
        },
        include: [model.Category],
      });
    }
    res.status(200).send({
      post: post,
    });
  } catch (error) {
    res.status(500).send({
      error: error.message,
    });
  }
};
module.exports.addPost = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { judul, isi, categoryId } = req.body;
  let excerpt = isi.substring(0, 30) + ".....";
  let slug = judul.toLowerCase().split(" ").join("-");
  let user;
  model.User.findByPk(req.auth.user_id, {
    attributes: ["id"],
  })
    .then((res) => {
      user = res;
      return model.Post.create({
        judul: judul,
        excerpt: excerpt,
        slug: slug,
        body: isi,
        gambar: req.file.filename,
      });
    })
    .then((p) => {
      user.addPosts(p);
      p.addCategory(categoryId, { through: model.CategoryPost });
      res.status(200).send({
        message: "sukses",
      });
    })
    .catch((err) => {
      res.status(500).send({
        error: err.message,
      });
    });
};
module.exports.editPost = async (req, res) => {
  const { judul, isi, categoryId } = req.body;
  if (req.file) {
    await model.Post.findOne({
      where: {
        id: req.params.id,
      },
    })
      .then((result) => {
        if (!result && result.UserId !== req.auth.user_id) {
          return res.status(401).send({
            message: "Anda tidak mempunyai hak akses",
          });
        }
        let excerpt = isi.substring(0, 30) + ".....";
        let slug = judul.toLowerCase().split(" ").join("-");
        model.Post.update(
          {
            judul: judul,
            excerpt: excerpt,
            slug: slug,
            body: isi,
            gambar: req.file.filename,
          },
          {
            where: {
              id: req.params.id,
            },
          },
          {
            include: [model.Category],
          }
        ).then(() => {
          return model.CategoryPost.destroy({
            where: {
              PostId: req.params.id,
            },
          }).then(() => {
            return model.Post.findOne({
              where: {
                id: req.params.id,
              },
              attributes: ["id"],
            }).then((post) => {
              post.addCategory(categoryId, { through: model.CategoryPost });
            });
          });
        });
        res.status(200).send({
          message: "sukses",
        });
      })
      .catch((err) => {
        return res.status(500).send({
          message: err.message,
        });
      });
  } else {
    await model.Post.findOne({
      where: {
        id: req.params.id,
      },
    })
      .then((result) => {
        if (!result && result.UserId !== req.auth.user_id) {
          return res.status(401).send({
            message: "Anda tidak mempunyai hak akses",
          });
        }
        let excerpt = isi.substring(0, 30) + ".....";
        let slug = judul.toLowerCase().split(" ").join("-");
        model.Post.update(
          {
            judul: judul,
            excerpt: excerpt,
            slug: slug,
            body: isi,
          },
          {
            where: {
              id: req.params.id,
            },
          },
          {
            include: [model.Category],
          }
        ).then(() => {
          return model.CategoryPost.destroy({
            where: {
              PostId: req.params.id,
            },
          }).then(() => {
            return model.Post.findOne({
              where: {
                id: req.params.id,
              },
              attributes: ["id"],
            }).then((post) => {
              post.addCategory(categoryId, { through: model.CategoryPost });
            });
          });
        });
        res.status(200).send({
          message: "sukses",
        });
      })
      .catch((err) => {
        return res.status(500).send({
          message: err.message,
        });
      });
  }
};
module.exports.hapusPost = (req, res) => {
  model.Post.destroy({
    where: {
      id: req.params.id,
    },
  })
    .then(() => {
      model.CategoryPost.destroy({
        where: {
          PostId: req.params.id,
        },
      });
      return res.status(200).send({
        message: "sukses",
      });
    })

    .catch((err) => {
      res.status(500).send({
        error: err.message,
      });
    });
};
