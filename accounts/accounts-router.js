const express = require('express')

const db = require('../data/dbConfig')
const knexfile = require('../knexfile')

const router = express.Router()

const Accounts = {
    getAll() {
        return db('accounts')
    },
    getById(id) {
        return db('accounts').where({ id }).first()
    },
    create(account) {
        return db('accounts')
        .insert(account, 'id')
        .then(([id]) => this.getById(id))
    },
    update(id, account) {
        return db('accounts')
        .where({ id })
        .update(account)
        .then((count) => (count > 0 ? this.getById(id): null))
    },
    delete(id) {
        return db('accounts').where({ id }).del()
    }
}

router.get('/', (req, res) => {
    Accounts.getAll()
    .then((data) => {
        res.status(200).json(data)
    }).catch((err) => {
        res.status(500).json(err.message)
    })
});

router.get('/:id', validateId, (req, res) => {
    Accounts.getById(req.params.id)
    .then((data) => {
        res.status(200).json(data)
    }).catch((err) => {
        res.status(500).json(err.message)
    })
});

router.post('/', (req, res) => {
    Accounts.create(req.body)
    .then((data) => {
        res.status(200).json(data)
    }).catch((err) => {
        res.status(500).json(err.message)
    })
});

router.put('/:id', validateId, (req, res) => {
    Accounts.update(req.params.id, req.body)
    .then((data) => {
        res.status(200).json(data)
    }).catch((err) => {
        res.status(500).json(err.message)
    })
});

router.delete('/:id', validateId, (req, res) => {
    Accounts.delete(req.params.id)
    .then((data) => {
        res.status(200).json({message: `Successfully deleted post with id ${req.params.id}`})
    }).catch((err) => {
        res.status(500).json(err.message)
    })
});

function validateId(req, res, next) {
    const { id } = req.params
    Accounts.getById(id)
    .then((data) => {
        if(data){
            req.action = data
            next()
        } else {
            res.status(400).json({message: `no accounts found with id ${id}`})
        }
    }).catch((err) => {
        res.status(500).json(err.message)
    })
}


module.exports = router;