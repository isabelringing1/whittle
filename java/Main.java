import java.io.File; 
import java.io.FileNotFoundException;
import java.util.Scanner;
import java.util.*;

public class Main {
    public static final String DATA_FILE = "../public/data/wl.txt"; 
    // set of all english words
    public static final Set<String> DICTIONARY = new HashSet<>();
    // map from <valid word> => <list of valid words that are one step before>
    public static final Map<String, Set<String>> PATHS = new HashMap<>();
    // map from <length of word> => <list of all valid words of that length>
    public static final Map<Integer, Set<String>> SOLUTIONS = new HashMap<>();
    public static final char[] LETTERS = "abcdefghijklmnopqrstuvwxyz".toCharArray();

    public static Set<String> getSolutions(int i) {
        if (SOLUTIONS.containsKey(i)) {
            return SOLUTIONS.get(i);
        }
        Set<String> list = new HashSet<>();
        SOLUTIONS.put(i, list);
        return list;
    }

    public static Set<String> getPaths(String str) {
        if (PATHS.containsKey(str)) {
            return PATHS.get(str);
        }
        Set<String> prefixes = new HashSet<>();
        PATHS.put(str, prefixes);
        return prefixes;
    }

    public static boolean isWordValid(String word) {
        if (DICTIONARY.contains(word)) return true;

        //for (String subWord : word.split(" ")) {
        //    if (!DICTIONARY.contains(subWord)) return false;
        //}
        return false;
    }

    public static void considerLetter(
        char letter,
        int goalLen,
        StringBuilder prefix,
        String prefixWord,
        Set<String> solutions
    ) {
        int lowOffset = 0;
        int highOffset = goalLen;
        for (int offset = lowOffset; offset < highOffset; offset++) {
            // NOTE: to support multiple spaces we'll want to ensure we're not putting a space
            // next to a space right here
            prefix.insert(offset, letter);
            String candidateWord = prefix.toString();

            if (isWordValid(candidateWord)) {
                solutions.add(candidateWord);
                getPaths(candidateWord).add(prefixWord);
            }

            prefix.deleteCharAt(offset);
        }
    }

    public static void findSolutions(int i) {
        Set<String> solutions = getSolutions(i);
        if (solutions.size() > 0) return;
        for (String prefixWord : getSolutions(i-1)) {
            StringBuilder prefix = new StringBuilder(prefixWord);
            for (char letter : LETTERS) {
                considerLetter(letter, i, prefix, prefixWord, solutions);
            }
            // No space in word already
            //if (prefix.indexOf(" ") == -1) {
            //    considerLetter(' ', i, prefix, prefixWord, solutions);
            //}
        }
    }

    /**
     * Given a goal string, return a list of all the ways to reach a 1-letter terminal state
     * 
     * Ex: getSolutionPaths("ai") = [["ai","a"], ["ai", "i"]]
     * (assuming "ai" is a valid word)
     * 
     * If given goal is 1 letter, simply return [[letter]].
     * Otherwise, get all the ways to get to all of its prefixes
     */
    public static List<List<String>> getSolutionPaths(String goal) {
        List<List<String>> solutionPaths = new ArrayList<>();
        if (goal.length() == 1) {
            List<String> solutionPath = new ArrayList<>();
            solutionPath.add(goal);
            solutionPaths.add(solutionPath);
            return solutionPaths;
        }
        for (String prefix : getPaths(goal)) {
            List<List<String>> prefixPaths = getSolutionPaths(prefix);

            for (List<String> path : getSolutionPaths(prefix)) {
                path.add(goal);
                solutionPaths.add(path);
            }
        }
        return solutionPaths;
    }

    public static void main(String[] args){
        try {
            File myObj = new File(DATA_FILE);
            Scanner myReader = new Scanner(myObj);
            while (myReader.hasNextLine()) {
                String word = myReader.nextLine().trim();
                if (!word.isEmpty()) {
                    DICTIONARY.add(word);
                }
            }
            myReader.close();
        } catch (FileNotFoundException e) {
            System.out.println("An error occurred.");
            e.printStackTrace();
        }

        System.out.println("Dictionary size: " + DICTIONARY.size());

        Set<String> oneLetterSolutions = getSolutions(1);
        oneLetterSolutions.add("i");
        oneLetterSolutions.add("a");
        // for (String word : DICTIONARY) {
        //     if (word.length() == 1) {
        //         oneLetterSolutions.add(word);
        //     }
        // }

        Scanner scan = new Scanner(System.in);
        while (true) {
            System.out.println("Enter length of word to see solutions for (ENTER to quit)");
            String resp = scan.nextLine().trim();
            if (resp.length() == 0) break;
            int len = Integer.parseInt(resp);

            for (int i = 2; i <= len; i++) findSolutions(i);

            while (true) {
                System.out.println("Here are the length " + len + " solutions:");
                System.out.println(getSolutions(len));
                System.out.println("\nWhich one do you want to see the path for? (ENTER to choose different length)");
                String choice = scan.nextLine().trim();
                if (choice.length() == 0) break;

                for (List<String> path : getSolutionPaths(choice)) {
                    StringJoiner joiner = new StringJoiner(",");
                    for (int i = path.size() - 1; i >= 0; i--) {
                        String word = path.get(i);
                        joiner.add(word);
                    }
                    System.out.println(joiner.toString());
                }
                System.out.println("\n(ENTER to continue)");
                scan.nextLine();
            }
        }
        // for (int i = 2; i <= 8; i++) {
        //     findSolutions(i);
        // }
    }

}