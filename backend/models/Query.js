import mongoose from 'mongoose'

const querySchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    queryText: {
        type: String,
        required: true
    },
    aiResponse: {
        type: String,
        required: true
    }
}, { timestamps: true })

const Query = mongoose.model('Query', querySchema)
export default Query
