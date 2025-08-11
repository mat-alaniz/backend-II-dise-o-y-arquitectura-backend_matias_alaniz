import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    first_name: { type: String, required: [true, "El nombre es obligatorio"], trim: true },
    last_name: { type: String, required: [true, "El apellido es obligatorio"], trim: true },
    email: { type: String, required: [true, "El email es obligatorio"], unique: true, trim: true, lowercase: true, validate:
         {
            validator: function(v) { return /^\S+@\S+\.\S+$/.test(v);}, message: props => `${props.value} no es un email válido!`
        }
    },
    password: { type: String, required: [true, "La contraseña es obligatoria"], minlength: [6, "La contraseña debe tener al menos 6 caracteres"] },
    age: { type: Number, required: [true, "La edad es obligatoria"], min: [18, "Debes ser mayor de 18 años"] },
    cart: { type: mongoose.Schema.Types.ObjectId, ref: 'Cart' },
    role: { type: String, enum: { values: ['user', 'admin'], message: 'El rol {VALUE} no es válido' }, default: 'user' }
}, {
    timestamps: true,
    versionKey: false
});

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});


userSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};


userSchema.post('save', function(error, doc, next) {
    if (error.name === 'MongoServerError' && error.code === 11000) {
        next(new Error('El email ya está registrado'));
    } else {
        next(error);
    }
});

export default mongoose.model('User', userSchema);