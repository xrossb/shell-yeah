{...}: {
  perSystem = {
    inputs',
    pkgs,
    self',
    ...
  }: let
    ags = inputs'.ags.packages.default.override {
      extraPackages = self'.packages.default.buildInputs;
    };
  in {
    devShells.default = pkgs.mkShell {
      buildInputs = with pkgs; [
        ags
        pnpm
        reflex
      ];

      FONTCONFIG_FILE = with pkgs;
        makeFontsConf {
          fontDirectories = [
            nerd-fonts.jetbrains-mono
            material-symbols
          ];
        };
    };
  };
}
