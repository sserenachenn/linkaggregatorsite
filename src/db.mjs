import mongooseSlugPlugin from 'mongoose-slug-plugin';

// TODO: add schemas
const UserSchema = new mongoose.Schema({
    username: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, unique: true, required: true}
});

const ArticleSchema = new mongoose.Schema({
    title: {type: String, required: true},
    url: {type: String, required: true},
});

// TODO: configure plugin
ArticleSchema.plugin(mongooseSlugPlugin, {tmpl: '<%=title%>'});

// TODO: register models
mongoose.model('User', UserSchema);
mongoose.model('Article', ArticleSchema);

mongoose.connect('mongodb://localhost/hw05');
