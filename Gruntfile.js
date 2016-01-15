module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    webpack: {
      compile: {
        // webpack options
        entry: "./src/aquto.js",
        output: {
            path: "./",
            filename: "aquto.js",
            library: ["aquto"],
            libraryTarget: "var"
        },

        stats: {
            // Configure the console output
            colors: false,
            modules: true,
            reasons: true
        },
        // stats: false disables the stats output

        storeStatsTo: "xyz", // writes the status to a variable named xyz
        // you may use it later in grunt i.e. <%= xyz.hash %>

        progress: true, // Don't show progress
        // Defaults to true

      }
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      build: {
        src: 'aquto.js',
        dest: 'aquto.min.js'
      }
    }
  });

  // Load plugins
  grunt.loadNpmTasks('grunt-webpack');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  // Default task(s).
  grunt.registerTask('default', ['webpack', 'uglify']);

};
